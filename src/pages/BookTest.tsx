import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Package, User, MapPin, CreditCard } from 'lucide-react';
import { SERVICE_PACKAGES, INDIAN_STATES, CROP_TYPES } from '../utils/constants';
import { BookingFormData } from '../types';

const BookTest = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    pickupType: 'pickup',
    paymentMethod: 'online',
  });
  const [bookingComplete, setBookingComplete] = useState(false);
  const [trackingId] = useState(`FH${Date.now().toString().slice(-8)}`);

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    setBookingComplete(true);
    setStep(5);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-16">
      {[1, 2, 3, 4].map((num) => (
        <div key={num} className="flex items-center">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl transition-all duration-300 hover-lift ${
              step >= num
                ? 'bg-primary-600 text-white shadow-lg hover:shadow-glow-green'
                : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
            }`}
          >
            {step > num ? <Check size={32} /> : num}
          </div>
          {num < 4 && (
            <div
              className={`w-20 h-2 mx-4 rounded-full transition-all duration-500 ${
                step > num ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        {!bookingComplete ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-gray-900 mb-2">
                Book Soil Test | मिट्टी परीक्षण बुक करें
              </h1>
              <p className="text-xl text-gray-600">Complete the form in 4 simple steps</p>
            </div>

            {renderStepIndicator()}

            <div className="bg-white rounded-3xl shadow-xl p-12 card-hover">
              {step === 1 && (
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <Package size={40} className="text-primary-600 hover-lift" />
                    <h2 className="text-4xl font-bold text-gray-900">Choose Package</h2>
                  </div>

                  <div className="space-y-4">
                    {SERVICE_PACKAGES.map((pkg) => (
                      <label
                        key={pkg.id}
                        className={`block border-2 rounded-2xl p-8 cursor-pointer transition-all duration-300 card-hover ${
                          formData.packageId === pkg.id
                            ? 'border-primary-600 bg-primary-50 shadow-lg hover:shadow-glow-green'
                            : 'border-gray-200 hover:border-primary-300 hover:bg-primary-25'
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
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <h3 className="text-3xl font-bold text-gray-900">{pkg.name}</h3>
                              {pkg.popular && (
                                <span className="bg-accent-500 text-white px-4 py-2 rounded-xl text-lg font-bold shadow-md hover-lift">
                                  POPULAR
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3 text-xl">{pkg.nameHindi}</p>
                            <p className="text-lg text-gray-600 mb-4">{pkg.description}</p>
                            <p className="text-lg text-gray-500">
                              Turnaround: {pkg.turnaroundDays} days
                            </p>
                          </div>
                          <div className="text-right ml-6">
                            <div className="text-5xl font-bold text-primary-600 hover-lift">₹{pkg.price}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <User size={40} className="text-primary-600 hover-lift" />
                    <h2 className="text-4xl font-bold text-gray-900">Farmer Details</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="form-label">
                        Full Name | किसान का नाम *
                      </label>
                      <input
                        type="text"
                        value={formData.farmerName || ''}
                        onChange={(e) => updateFormData('farmerName', e.target.value)}
                        className="form-input"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="form-label">
                        Mobile Number | मोबाइल नंबर *
                      </label>
                      <input
                        type="tel"
                        value={formData.mobile || ''}
                        onChange={(e) => updateFormData('mobile', e.target.value)}
                        className="form-input"
                        placeholder="+91"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="form-label">
                          Village | गांव *
                        </label>
                        <input
                          type="text"
                          value={formData.village || ''}
                          onChange={(e) => updateFormData('village', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">
                          District | जिला *
                        </label>
                        <input
                          type="text"
                          value={formData.district || ''}
                          onChange={(e) => updateFormData('district', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">
                          State | राज्य *
                        </label>
                        <select
                          value={formData.state || ''}
                          onChange={(e) => updateFormData('state', e.target.value)}
                          className="form-input"
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">
                        Crop Type | फसल का प्रकार *
                      </label>
                      <select
                        value={formData.cropType || ''}
                        onChange={(e) => updateFormData('cropType', e.target.value)}
                        className="form-input"
                      >
                        <option value="">Select Crop</option>
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
                  <div className="flex items-center gap-4 mb-8">
                    <MapPin size={40} className="text-primary-600 hover-lift" />
                    <h2 className="text-4xl font-bold text-gray-900">Sample Collection</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <label
                        className={`border-2 rounded-2xl p-8 cursor-pointer transition-all duration-300 card-hover ${
                          formData.pickupType === 'pickup'
                            ? 'border-primary-600 bg-primary-50 shadow-lg hover:shadow-glow-green'
                            : 'border-gray-200 hover:border-primary-300 hover:bg-primary-25'
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
                        <h3 className="text-3xl font-bold text-gray-900 mb-3">
                          Free Pickup | मुफ्त पिकअप
                        </h3>
                        <p className="text-gray-600 text-xl">
                          Our representative will collect soil sample from your farm within 2 working days
                        </p>
                      </label>

                      <label
                        className={`border-2 rounded-2xl p-8 cursor-pointer transition-all duration-300 card-hover ${
                          formData.pickupType === 'drop'
                            ? 'border-primary-600 bg-primary-50 shadow-lg hover:shadow-glow-green'
                            : 'border-gray-200 hover:border-primary-300 hover:bg-primary-25'
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
                        <h3 className="text-3xl font-bold text-gray-900 mb-3">
                          Drop at Center | सेंटर पर जमा करें
                        </h3>
                        <p className="text-gray-600 text-xl">
                          Drop your soil sample at nearest collection center. Find center details after booking.
                        </p>
                      </label>
                    </div>

                    {formData.pickupType === 'pickup' && (
                      <div>
                        <label className="form-label">
                          Complete Farm Address for Pickup *
                        </label>
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
                </div>
              )}

              {step === 4 && (
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <CreditCard size={40} className="text-primary-600 hover-lift" />
                    <h2 className="text-4xl font-bold text-gray-900">Payment & Confirmation</h2>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-8 mb-8 shadow-lg">
                    <h3 className="font-bold text-gray-900 mb-6 text-2xl">Booking Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-xl">Package:</span>
                        <span className="font-semibold text-xl">
                          {SERVICE_PACKAGES.find((p) => p.id === formData.packageId)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-xl">Farmer:</span>
                        <span className="font-semibold text-xl">{formData.farmerName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-xl">Mobile:</span>
                        <span className="font-semibold text-xl">{formData.mobile}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-xl">Location:</span>
                        <span className="font-semibold text-xl">
                          {formData.village}, {formData.district}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-xl">Collection:</span>
                        <span className="font-semibold text-xl">
                          {formData.pickupType === 'pickup' ? 'Free Pickup' : 'Drop at Center'}
                        </span>
                      </div>
                      <div className="border-t border-gray-300 pt-4 mt-4 flex justify-between items-center text-xl">
                        <span className="font-bold text-gray-900 text-2xl">Total Amount:</span>
                        <span className="font-bold text-primary-600 text-4xl">
                          ₹{SERVICE_PACKAGES.find((p) => p.id === formData.packageId)?.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="form-label">
                        Payment Method
                      </label>
                      <div className="space-y-4">
                        <label className={`flex items-center gap-4 border-2 border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-300 card-hover ${
                          formData.paymentMethod === 'online'
                            ? 'border-primary-600 bg-primary-50 shadow-lg'
                            : 'hover:border-primary-300'
                        }`}>
                          <input
                            type="radio"
                            name="payment"
                            value="online"
                            checked={formData.paymentMethod === 'online'}
                            onChange={(e) => updateFormData('paymentMethod', e.target.value)}
                            className="w-6 h-6 text-primary-600"
                          />
                          <span className="font-semibold text-xl">Pay Online (UPI/Card/Wallet)</span>
                        </label>
                        <label className={`flex items-center gap-4 border-2 border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-300 card-hover ${
                          formData.paymentMethod === 'cod'
                            ? 'border-primary-600 bg-primary-50 shadow-lg'
                            : 'hover:border-primary-300'
                        }`}>
                          <input
                            type="radio"
                            name="payment"
                            value="cod"
                            checked={formData.paymentMethod === 'cod'}
                            onChange={(e) => updateFormData('paymentMethod', e.target.value)}
                            className="w-6 h-6 text-primary-600"
                          />
                          <span className="font-semibold text-xl">Cash on Sample Collection</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
                {step > 1 && (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-3 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover-lift transition-all duration-300 text-xl"
                  >
                    <ChevronLeft size={24} />
                    Previous
                  </button>
                )}
                {step < 4 ? (
                  <button
                    onClick={nextStep}
                    disabled={
                      (step === 1 && !formData.packageId) ||
                      (step === 2 && (!formData.farmerName || !formData.mobile || !formData.village || !formData.district || !formData.state || !formData.cropType))
                    }
                    className="flex items-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 hover:shadow-button-hover hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ml-auto text-xl"
                  >
                    Next
                    <ChevronRight size={24} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="btn-primary ml-auto animate-pulse-slow text-xl"
                  >
                    Confirm Booking
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center card-hover">
            <div className="w-24 h-24 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-8 hover-lift">
              <Check size={56} className="text-primary-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Booking Confirmed!</h2>
            <p className="text-2xl text-gray-600 mb-10">
              Your soil test has been successfully booked
            </p>
            <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-8 mb-10 shadow-lg">
              <p className="text-lg text-gray-600 mb-3">Your Tracking ID</p>
              <p className="text-4xl font-bold text-primary-600 mb-3 hover-lift">{trackingId}</p>
              <p className="text-lg text-gray-600">
                Save this ID to check your report status
              </p>
            </div>
            <div className="space-y-4 text-left max-w-lg mx-auto mb-10">
              <div className="flex items-start gap-4">
                <Check size={24} className="text-primary-600 mt-1 flex-shrink-0 hover-lift" />
                <p className="text-gray-700 text-lg">SMS confirmation sent to {formData.mobile}</p>
              </div>
              <div className="flex items-start gap-4">
                <Check size={24} className="text-primary-600 mt-1 flex-shrink-0 hover-lift" />
                <p className="text-gray-700 text-lg">
                  {formData.pickupType === 'pickup'
                    ? 'Sample pickup scheduled within 2 working days'
                    : 'Collection center details sent via SMS'}
                </p>
              </div>
              <div className="flex items-start gap-4">
                <Check size={24} className="text-primary-600 mt-1 flex-shrink-0 hover-lift" />
                <p className="text-gray-700 text-lg">
                  Report will be available in{' '}
                  {SERVICE_PACKAGES.find((p) => p.id === formData.packageId)?.turnaroundDays} days
                </p>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary animate-bounce-subtle"
            >
              Book Another Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookTest;
