import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, CreditCard, MapPin, Package, User } from 'lucide-react';
import { SERVICE_PACKAGES, INDIAN_STATES, CROP_TYPES } from '../utils/constants';
import type { BookingFormData } from '../types';
import { createBooking } from '../services/bookings';
import { createPaymentOrder, verifyPaymentSignature } from '../services/payments';

const BookTest = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    pickupType: 'pickup',
    paymentMethod: 'online',
  });
  const [bookingComplete, setBookingComplete] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const selectedPackage = SERVICE_PACKAGES.find((p) => p.id === formData.packageId);

  const updateFormData = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetFlow = () => {
    setStep(1);
    setFormData({ pickupType: 'pickup', paymentMethod: 'online' });
    setBookingComplete(false);
    setTrackingId('');
    setSubmitError('');
  };

  const canProceed = () => {
    if (step === 1) {
      return Boolean(formData.packageId);
    }
    if (step === 2) {
      return Boolean(
        formData.farmerName &&
          formData.mobile &&
          formData.village &&
          formData.district &&
          formData.state &&
          formData.cropType
      );
    }
    if (step === 3) {
      if (formData.pickupType === 'pickup') {
        return Boolean(formData.address?.trim());
      }
      return true;
    }
    return true;
  };

  const loadRazorpayScript = () =>
    new Promise<boolean>((resolve) => {
      if ((window as Window & { Razorpay?: unknown }).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubmit = async () => {
    if (!selectedPackage) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const generatedTrackingId = `FH${Date.now().toString().slice(-8)}`;
      const booking = await createBooking({
        package_id: formData.packageId!,
        tracking_id: generatedTrackingId,
        farmer_name: formData.farmerName!,
        mobile: formData.mobile!,
        village: formData.village!,
        district: formData.district!,
        state: formData.state!,
        crop_type: formData.cropType!,
        pickup_type: formData.pickupType as 'pickup' | 'drop',
        address: formData.address,
        payment_method: formData.paymentMethod!,
        payment_status: formData.paymentMethod === 'online' ? 'created' : 'pending',
        status: 'pending',
      });

      if (formData.paymentMethod === 'online') {
        const sdkLoaded = await loadRazorpayScript();
        if (!sdkLoaded) {
          throw new Error('Unable to load Razorpay SDK');
        }

        const paymentOrder = await createPaymentOrder({
          user_id: null,
          purpose: 'soil_test',
          purpose_ref_id: booking.id,
          amount_inr: selectedPackage.price,
          currency: 'INR',
        });

        await new Promise<void>((resolve, reject) => {
          const RazorpayCtor = (
            window as unknown as {
              Razorpay: new (options: Record<string, unknown>) => { open: () => void };
            }
          ).Razorpay;

          const razorpay = new RazorpayCtor({
            key: paymentOrder.key_id,
            amount: paymentOrder.amount_paise,
            currency: paymentOrder.currency,
            name: 'FarmHith',
            description: `Soil Test Booking (${generatedTrackingId})`,
            order_id: paymentOrder.razorpay_order_id,
            prefill: {
              name: formData.farmerName,
              contact: formData.mobile,
            },
            notes: {
              tracking_id: generatedTrackingId,
              booking_id: booking.id,
            },
            handler: async (response: {
              razorpay_order_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            }) => {
              try {
                await verifyPaymentSignature(response);
                resolve();
              } catch (error) {
                reject(error);
              }
            },
            modal: {
              ondismiss: () => reject(new Error('Payment cancelled by user')),
            },
            theme: {
              color: '#2f814d',
            },
          });

          razorpay.open();
        });
      }

      setTrackingId(generatedTrackingId);
      setBookingComplete(true);
      setStep(5);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {[1, 2, 3, 4].map((num) => (
        <div
          key={num}
          className={`rounded-2xl border p-3 text-center transition-all duration-300 ${
            step >= num
              ? 'border-primary-300 bg-primary-50 text-primary-800'
              : 'border-primary-100 bg-white text-slate-500'
          }`}
        >
          <p className="text-xs font-semibold">Step {num}</p>
          <p className="text-sm mt-1">{step > num ? 'Completed' : step === num ? 'Current' : 'Pending'}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="ambient-orb top-[-8%] left-[-8%] h-72 w-72 bg-primary-300/60" />
        <div className="ambient-orb right-[-8%] bottom-[-20%] h-80 w-80 bg-accent-200/70" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!bookingComplete ? (
          <>
            <div className="text-center max-w-3xl mx-auto mb-8">
              <span className="inline-flex rounded-full border border-primary-200 bg-white/90 px-4 py-1.5 text-xs font-semibold text-primary-700">
                Fast booking and Razorpay checkout
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl font-display text-slate-900">
                Book your soil test in four steps
              </h1>
              <p className="mt-3 text-slate-600">
                Select package, add farm details, choose collection mode, and confirm payment.
              </p>
            </div>

            {renderStepIndicator()}

            <div className="card-hover surface-3d p-6 md:p-8">
              {step === 1 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Package size={24} className="text-primary-700" />
                    <h2 className="text-2xl md:text-3xl">Choose Package</h2>
                  </div>

                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {SERVICE_PACKAGES.map((pkg) => (
                      <label
                        key={pkg.id}
                        className={`rounded-2xl border p-5 cursor-pointer transition-all duration-300 ${
                          formData.packageId === pkg.id
                            ? 'border-primary-500 bg-primary-50 shadow-glow-green'
                            : 'border-primary-100 bg-white hover:border-primary-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="package"
                          value={pkg.id}
                          checked={formData.packageId === pkg.id}
                          onChange={(e) => updateFormData('packageId', e.target.value)}
                          className="sr-only"
                        />
                        <p className="text-sm text-primary-700 font-semibold">{pkg.turnaroundDays} days turnaround</p>
                        <h3 className="text-xl mt-1 font-semibold text-slate-900">{pkg.name}</h3>
                        <p className="text-sm text-slate-600 mt-2 min-h-[38px]">{pkg.description}</p>
                        <p className="text-3xl font-display text-primary-700 mt-4">Rs {pkg.price}</p>
                        {pkg.popular && (
                          <span className="inline-flex mt-3 rounded-full bg-accent-500 px-3 py-1 text-xs text-white font-semibold">
                            Most Popular
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <User size={24} className="text-primary-700" />
                    <h2 className="text-2xl md:text-3xl">Farmer Details</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        value={formData.farmerName || ''}
                        onChange={(e) => updateFormData('farmerName', e.target.value)}
                        className="form-input"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="form-label">Mobile Number *</label>
                      <input
                        type="tel"
                        value={formData.mobile || ''}
                        onChange={(e) => updateFormData('mobile', e.target.value)}
                        className="form-input"
                        placeholder="+91 9876543210"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="form-label">Village *</label>
                        <input
                          type="text"
                          value={formData.village || ''}
                          onChange={(e) => updateFormData('village', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">District *</label>
                        <input
                          type="text"
                          value={formData.district || ''}
                          onChange={(e) => updateFormData('district', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">State *</label>
                        <select
                          value={formData.state || ''}
                          onChange={(e) => updateFormData('state', e.target.value)}
                          className="form-input"
                        >
                          <option value="">Select state</option>
                          {INDIAN_STATES.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Crop Type *</label>
                      <select
                        value={formData.cropType || ''}
                        onChange={(e) => updateFormData('cropType', e.target.value)}
                        className="form-input"
                      >
                        <option value="">Select crop</option>
                        {CROP_TYPES.map((crop) => (
                          <option key={crop} value={crop}>
                            {crop}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin size={24} className="text-primary-700" />
                    <h2 className="text-2xl md:text-3xl">Sample Collection</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <label
                      className={`rounded-2xl border p-5 cursor-pointer transition-all duration-300 ${
                        formData.pickupType === 'pickup'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-primary-100 bg-white hover:border-primary-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pickupType"
                        value="pickup"
                        checked={formData.pickupType === 'pickup'}
                        onChange={(e) => updateFormData('pickupType', e.target.value)}
                        className="sr-only"
                      />
                      <h3 className="text-xl font-semibold text-slate-900">Free Pickup</h3>
                      <p className="text-sm text-slate-600 mt-2">
                        Our representative collects the sample from your farm.
                      </p>
                    </label>

                    <label
                      className={`rounded-2xl border p-5 cursor-pointer transition-all duration-300 ${
                        formData.pickupType === 'drop'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-primary-100 bg-white hover:border-primary-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pickupType"
                        value="drop"
                        checked={formData.pickupType === 'drop'}
                        onChange={(e) => updateFormData('pickupType', e.target.value)}
                        className="sr-only"
                      />
                      <h3 className="text-xl font-semibold text-slate-900">Drop at Center</h3>
                      <p className="text-sm text-slate-600 mt-2">
                        You can submit the sample at the nearest collection center.
                      </p>
                    </label>
                  </div>

                  {formData.pickupType === 'pickup' && (
                    <div className="mt-4">
                      <label className="form-label">Pickup Address *</label>
                      <textarea
                        value={formData.address || ''}
                        onChange={(e) => updateFormData('address', e.target.value)}
                        rows={4}
                        className="form-input resize-none"
                        placeholder="Enter complete farm address with landmarks"
                      />
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard size={24} className="text-primary-700" />
                    <h2 className="text-2xl md:text-3xl">Payment and Confirmation</h2>
                  </div>

                  <div className="rounded-2xl border border-primary-100 bg-[#f8fdf9] p-5 mb-5">
                    <h3 className="font-semibold text-slate-900 mb-4">Booking Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Package</span>
                        <span className="font-semibold text-slate-900">{selectedPackage?.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Farmer</span>
                        <span className="font-semibold text-slate-900">{formData.farmerName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Mobile</span>
                        <span className="font-semibold text-slate-900">{formData.mobile}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Collection</span>
                        <span className="font-semibold text-slate-900">
                          {formData.pickupType === 'pickup' ? 'Free pickup' : 'Drop at center'}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-primary-100 flex items-center justify-between">
                        <span className="font-semibold text-slate-900">Total Amount</span>
                        <span className="text-2xl font-display text-primary-700">Rs {selectedPackage?.price}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Payment Method</label>
                    <div className="space-y-3">
                      <label
                        className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-300 ${
                          formData.paymentMethod === 'online'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-primary-100 hover:border-primary-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="online"
                          checked={formData.paymentMethod === 'online'}
                          onChange={(e) => updateFormData('paymentMethod', e.target.value)}
                        />
                        <span className="text-sm font-semibold text-slate-800">Pay online (UPI / Card / Wallet)</span>
                      </label>
                      <label
                        className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-300 ${
                          formData.paymentMethod === 'cod'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-primary-100 hover:border-primary-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={(e) => updateFormData('paymentMethod', e.target.value)}
                        />
                        <span className="text-sm font-semibold text-slate-800">Cash on sample collection</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-primary-100 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    onClick={() => setStep((prev) => prev - 1)}
                    className="btn-secondary"
                    disabled={isSubmitting}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                ) : (
                  <span />
                )}

                {step < 4 ? (
                  <button
                    onClick={() => setStep((prev) => prev + 1)}
                    disabled={!canProceed() || isSubmitting}
                    className="btn-primary disabled:opacity-60"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed() || isSubmitting}
                    className="btn-primary disabled:opacity-60"
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto card-hover surface-3d p-8 md:p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mx-auto">
              <Check size={28} />
            </div>
            <h2 className="text-3xl md:text-4xl mt-5">Booking Confirmed</h2>
            <p className="text-slate-600 mt-3">Your soil test request is successfully created.</p>

            <div className="mt-6 rounded-2xl border border-primary-100 bg-[#f8fdf9] p-5">
              <p className="text-sm text-slate-600">Tracking ID</p>
              <p className="text-3xl font-display text-primary-700 mt-2">{trackingId}</p>
              <p className="text-sm text-slate-600 mt-2">Save this ID to view your report timeline.</p>
            </div>

            <div className="mt-6 text-left max-w-lg mx-auto space-y-2 text-sm text-slate-700">
              <p>- Confirmation has been sent to {formData.mobile}.</p>
              <p>
                - {formData.pickupType === 'pickup'
                  ? 'Sample pickup is expected within 2 working days.'
                  : 'Collection center details will be shared shortly.'}
              </p>
              <p>- Estimated report time: {selectedPackage?.turnaroundDays} days.</p>
            </div>

            <button onClick={resetFlow} className="btn-primary mt-7">
              Book Another Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookTest;
