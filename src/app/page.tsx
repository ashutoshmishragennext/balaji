'use client'
import React, { useState, useRef, useEffect } from 'react';
import { User, Phone, Mail, Package, Settings, Wrench, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
  visitorName: string;
  phoneNo: string;
  emailId: string;
  currentStrapper: string;
  modelInterested: string;
  make: string;
  serviceRoll: string;
  remarks: string;
}

export default function VisitorForm() {
  const [formData, setFormData] = useState<FormData>({
    visitorName: '',
    phoneNo: '',
    emailId: '',
    currentStrapper: '',
    modelInterested: '',
    make: '',
    serviceRoll: '',
    remarks: ''
  });

  const [focusedField, setFocusedField] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Refs for form fields to scroll to on error
  const visitorNameRef = useRef<HTMLInputElement>(null);
  const phoneNoRef = useRef<HTMLInputElement>(null);
  const emailIdRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Scroll to the first error field
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = Object.keys(validationErrors)[0];
      
      // Small delay to ensure the error message is rendered
      setTimeout(() => {
        switch (firstErrorField) {
          case 'visitorName':
            visitorNameRef.current?.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
            visitorNameRef.current?.focus();
            break;
          case 'phoneNo':
            phoneNoRef.current?.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
            phoneNoRef.current?.focus();
            break;
          case 'emailId':
            emailIdRef.current?.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
            emailIdRef.current?.focus();
            break;
          default:
            break;
        }
      }, 100);
    }
  }, [validationErrors]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const requiredFields = ['visitorName', 'phoneNo', 'emailId'];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof FormData].trim()) {
        const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
        errors[field] = `Please fill in the ${fieldName}`;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.emailId && !emailRegex.test(formData.emailId)) {
      errors.emailId = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[+]?[0-9\s-()]{10,}$/;
    if (formData.phoneNo && !phoneRegex.test(formData.phoneNo)) {
      errors.phoneNo = 'Please enter a valid phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSubmitStatus('error');
      setMessage('Please fix the validation errors');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Send data to Next.js API route
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setMessage('Form submitted successfully! Email has been sent.');
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            visitorName: '',
            phoneNo: '',
            emailId: '',
            currentStrapper: '',
            modelInterested: '',
            make: '',
            serviceRoll: '',
            remarks: ''
          });
          setSubmitStatus('idle');
          setMessage('');
          setValidationErrors({});
        }, 3000);
      } else {
        throw new Error(result.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setMessage('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-red-50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200 to-red-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-10 blur-2xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header with Enhanced Design */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 mb-8 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-blue-500/5"></div>
          <div className="relative flex items-center justify-center sm:justify-between flex-col sm:flex-row gap-4">
            <div className="relative">
              <img src={'/logo.jpg'} className='h-16 md:h-20 object-contain' alt="Shree Balaji Packtech Logo" />
              <div className="absolute -inset-2 bg-gradient-to-br from-red-200 to-red-300 rounded-2xl opacity-20 blur-lg"></div>
            </div>
            <div className="text-center sm:text-right space-y-2">
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                SHREE BALAJI
              </h1>
              <p className="text-xl md:text-2xl font-bold text-gray-800 tracking-wide">PACKTECH</p>
              <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto sm:ml-auto"></div>
            </div>
          </div>
        </div>

        {/* Form with Glassmorphism Effect */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/20"></div>
          
          <div className="relative space-y-6 lg:space-y-8">
            <div className="text-center mb-6 lg:mb-8">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Visitor Information</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto rounded-full"></div>
            </div>

            {/* Status Messages */}
            {submitStatus !== 'idle' && (
              <div className={`p-4 rounded-xl flex items-center space-x-3 ${
                submitStatus === 'success' 
                  ? 'bg-green-100 border border-green-300 text-green-800' 
                  : 'bg-red-100 border border-red-300 text-red-800'
              }`}>
                {submitStatus === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="font-medium">{message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Visitor Name - Full Width */}
              <div className="lg:col-span-2" ref={visitorNameRef}>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <User className="w-4 h-4 mr-2 text-red-500" />
                  VISITOR NAME *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="visitorName"
                    value={formData.visitorName}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('visitorName')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 lg:px-5 py-3 lg:py-4 bg-white/60 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                      focusedField === 'visitorName' 
                        ? 'border-red-500 shadow-lg shadow-red-500/20 bg-white/80' 
                        : validationErrors.visitorName
                          ? 'border-red-300 bg-red-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Enter visitor name"
                    required
                  />
                  {validationErrors.visitorName && (
                    <p className="text-red-500 text-xs mt-2 ml-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {validationErrors.visitorName}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div ref={phoneNoRef}>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Phone className="w-4 h-4 mr-2 text-green-500" />
                  PHONE NO. *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('phoneNo')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 lg:px-5 py-3 lg:py-4 bg-white/60 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                      focusedField === 'phoneNo' 
                        ? 'border-green-500 shadow-lg shadow-green-500/20 bg-white/80' 
                        : validationErrors.phoneNo
                          ? 'border-red-300 bg-red-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                  {validationErrors.phoneNo && (
                    <p className="text-red-500 text-xs mt-2 ml-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {validationErrors.phoneNo}
                    </p>
                  )}
                </div>
              </div>

              {/* Email ID */}
              <div ref={emailIdRef}>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Mail className="w-4 h-4 mr-2 text-blue-500" />
                  EMAIL ID *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('emailId')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 lg:px-5 py-3 lg:py-4 bg-white/60 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                      focusedField === 'emailId' 
                        ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-white/80' 
                        : validationErrors.emailId
                          ? 'border-red-300 bg-red-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="email@example.com"
                    required
                  />
                  {validationErrors.emailId && (
                    <p className="text-red-500 text-xs mt-2 ml-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {validationErrors.emailId}
                    </p>
                  )}
                </div>
              </div>

              {/* Current Strapper */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Package className="w-4 h-4 mr-2 text-purple-500" />
                  CURRENT STRAPPER
                </label>
                <input
                  type="text"
                  name="currentStrapper"
                  value={formData.currentStrapper}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('currentStrapper')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full px-4 lg:px-5 py-3 lg:py-4 bg-white/60 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                    focusedField === 'currentStrapper' 
                      ? 'border-purple-500 shadow-lg shadow-purple-500/20 bg-white/80' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Semi auto or speed"
                />
              </div>

              {/* Model Interested */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Settings className="w-4 h-4 mr-2 text-orange-500" />
                  MODEL INTERESTED
                </label>
                <input
                  type="text"
                  name="modelInterested"
                  value={formData.modelInterested}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('modelInterested')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full px-4 lg:px-5 py-3 lg:py-4 bg-white/60 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                    focusedField === 'modelInterested' 
                      ? 'border-orange-500 shadow-lg shadow-orange-500/20 bg-white/80' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Model specification"
                />
              </div>

              {/* Make */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Wrench className="w-4 h-4 mr-2 text-indigo-500" />
                  MAKE
                </label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('make')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full px-4 lg:px-5 py-3 lg:py-4 bg-white/60 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                    focusedField === 'make' 
                      ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 bg-white/80' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Manufacturer details"
                />
              </div>

              {/* Service/PT Roll */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Settings className="w-4 h-4 mr-2 text-teal-500" />
                  SERVICE / PT ROLL
                </label>
                <input
                  type="text"
                  name="serviceRoll"
                  value={formData.serviceRoll}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('serviceRoll')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full px-4 lg:px-5 py-3 lg:py-4 bg-white/60 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                    focusedField === 'serviceRoll' 
                      ? 'border-teal-500 shadow-lg shadow-teal-500/20 bg-white/80' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Service requirements"
                />
              </div>
            </div>

            {/* Remarks Section - Full Width */}
            <div className="lg:col-span-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <MessageSquare className="w-4 h-4 mr-2 text-pink-500" />
                REMARKS
              </label>
              <textarea
                name="remarks"
                rows={4}
                value={formData.remarks}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('remarks')}
                onBlur={() => setFocusedField('')}
                className={`w-full px-4 lg:px-5 py-3 lg:py-4 bg-white/60 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 resize-none ${
                  focusedField === 'remarks' 
                    ? 'border-pink-500 shadow-lg shadow-pink-500/20 bg-white/80' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="Additional comments, requirements, or questions..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 lg:pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`group relative w-full font-bold py-4 lg:py-5 px-6 lg:px-8 rounded-xl overflow-hidden transition-all duration-300 transform shadow-2xl ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed scale-100'
                    : 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white hover:scale-[1.02] active:scale-[0.98] hover:shadow-red-500/30'
                }`}
              >
                <div className={`absolute inset-0 transition-opacity duration-300 ${
                  isSubmitting ? 'bg-gray-500' : 'bg-gradient-to-r from-red-600 to-red-800 opacity-0 group-hover:opacity-100'
                }`}></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <Send className={`w-5 h-5 transition-transform duration-300 ${
                    isSubmitting ? 'animate-pulse' : 'group-hover:translate-x-1'
                  }`} />
                  <span className="text-base lg:text-lg">
                    {isSubmitting ? 'Submitting...' : 'Submit Information'}
                  </span>
                </div>
                
                {/* Animated border */}
                {!isSubmitting && (
                  <div className="absolute inset-0 rounded-xl">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-24 lg:w-32 h-24 lg:h-32 bg-gradient-to-br from-red-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-20 lg:w-24 h-20 lg:h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl"></div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 lg:mt-12">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-lg px-4 lg:px-6 py-2 lg:py-3 rounded-full border border-white/30">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-gray-600 text-xs lg:text-sm font-medium">© 2024 Shree Balaji Packtech - Powered by Innovation</p>
          </div>
        </div>
      </div>
    </div>
  );
}