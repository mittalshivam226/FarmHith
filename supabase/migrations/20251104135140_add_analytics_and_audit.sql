-- Add analytics and audit tables for better tracking and insights
-- This migration adds tables for analytics, audit logs, and system metrics

-- Analytics table for tracking key metrics
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value numeric,
  metric_type text NOT NULL CHECK (metric_type IN ('count', 'sum', 'avg', 'rate')),
  category text NOT NULL DEFAULT 'general',
  tags jsonb DEFAULT '{}',
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_metric_name ON analytics(metric_name);
CREATE INDEX IF NOT EXISTS idx_analytics_category ON analytics(category);
CREATE INDEX IF NOT EXISTS idx_analytics_recorded_at ON analytics(recorded_at);

-- Audit log table for tracking all important actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- System health monitoring table
CREATE TABLE IF NOT EXISTS system_health (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  component text NOT NULL,
  status text NOT NULL CHECK (status IN ('healthy', 'warning', 'error')),
  message text,
  metrics jsonb DEFAULT '{}',
  checked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for system health
CREATE INDEX IF NOT EXISTS idx_system_health_component ON system_health(component);
CREATE INDEX IF NOT EXISTS idx_system_health_status ON system_health(status);
CREATE INDEX IF NOT EXISTS idx_system_health_checked_at ON system_health(checked_at);

-- Enable RLS on new tables
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Analytics: Only admins can view
CREATE POLICY "Admins can view analytics"
  ON analytics FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin'));

-- Audit logs: Only admins can view
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin'));

-- System health: Only admins can view and manage
CREATE POLICY "Admins can manage system health"
  ON system_health FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'super_admin'));

-- Function to automatically log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id uuid DEFAULT NULL,
  p_action text DEFAULT '',
  p_resource_type text DEFAULT '',
  p_resource_id text DEFAULT NULL,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id, action, resource_type, resource_id,
    old_values, new_values, metadata
  ) VALUES (
    p_user_id, p_action, p_resource_type, p_resource_id,
    p_old_values, p_new_values, p_metadata
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record analytics metrics
CREATE OR REPLACE FUNCTION record_analytics_metric(
  p_metric_name text,
  p_metric_value numeric DEFAULT NULL,
  p_metric_type text DEFAULT 'count',
  p_category text DEFAULT 'general',
  p_tags jsonb DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
  INSERT INTO analytics (
    metric_name, metric_value, metric_type, category, tags
  ) VALUES (
    p_metric_name, p_metric_value, p_metric_type, p_category, p_tags
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update system health status
CREATE OR REPLACE FUNCTION update_system_health(
  p_component text,
  p_status text,
  p_message text DEFAULT NULL,
  p_metrics jsonb DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
  INSERT INTO system_health (component, status, message, metrics)
  VALUES (p_component, p_status, p_message, p_metrics);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for automatic audit logging on key tables

-- Audit trigger for bookings
CREATE OR REPLACE FUNCTION audit_bookings_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_audit_event(
      NULL, 'create', 'booking', NEW.id::text,
      NULL, row_to_json(NEW)::jsonb,
      jsonb_build_object('table', 'bookings')
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_audit_event(
      NULL, 'update', 'booking', NEW.id::text,
      row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb,
      jsonb_build_object('table', 'bookings')
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_audit_event(
      NULL, 'delete', 'booking', OLD.id::text,
      row_to_json(OLD)::jsonb, NULL,
      jsonb_build_object('table', 'bookings')
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers
DROP TRIGGER IF EXISTS audit_bookings ON bookings;
CREATE TRIGGER audit_bookings
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION audit_bookings_changes();

-- Similar triggers for reports and contact_messages
CREATE OR REPLACE FUNCTION audit_reports_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_audit_event(
      NULL, 'create', 'report', NEW.id::text,
      NULL, row_to_json(NEW)::jsonb,
      jsonb_build_object('table', 'reports')
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_audit_event(
      NULL, 'update', 'report', NEW.id::text,
      row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb,
      jsonb_build_object('table', 'reports')
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_audit_event(
      NULL, 'delete', 'report', OLD.id::text,
      row_to_json(OLD)::jsonb, NULL,
      jsonb_build_object('table', 'reports')
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS audit_reports ON reports;
CREATE TRIGGER audit_reports
  AFTER INSERT OR UPDATE OR DELETE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION audit_reports_changes();

CREATE OR REPLACE FUNCTION audit_contact_messages_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_audit_event(
      NULL, 'create', 'contact_message', NEW.id::text,
      NULL, row_to_json(NEW)::jsonb,
      jsonb_build_object('table', 'contact_messages')
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_audit_event(
      NULL, 'update', 'contact_message', NEW.id::text,
      row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb,
      jsonb_build_object('table', 'contact_messages')
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_audit_event(
      NULL, 'delete', 'contact_message', OLD.id::text,
      row_to_json(OLD)::jsonb, NULL,
      jsonb_build_object('table', 'contact_messages')
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS audit_contact_messages ON contact_messages;
CREATE TRIGGER audit_contact_messages
  AFTER INSERT OR UPDATE OR DELETE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION audit_contact_messages_changes();
