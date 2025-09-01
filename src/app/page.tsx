/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useRef, useEffect } from 'react';
import { User, Phone, Mail, Package, Settings, Wrench, MessageSquare, Send, CheckCircle, AlertCircle, Building, Calendar } from 'lucide-react';

interface FormData {
  // Personal Information
  companyName: string;
  personName: string;
  phone: string;
  email: string;
  
  // Existing Machine
  make: string;
  model: string;
  technicalSupport: string[];
  
  // New Machine
  newMachineModel: string;
  
  // Event
  eventName: string;
  
  remarks: string;
}

export default function VisitorForm() {
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    personName: '',
    phone: '',
    email: '',
    make: '',
    model: '',
    technicalSupport: [],
    newMachineModel: '',
    eventName: '',
    remarks: ''
  });

  const [focusedField, setFocusedField] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showThankYou, setShowThankYou] = useState(false);

  // Refs for form fields to scroll to on error
  const companyNameRef = useRef<HTMLInputElement>(null);
  const personNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      technicalSupport: prev.technicalSupport.includes(value)
        ? prev.technicalSupport.filter(item => item !== value)
        : [...prev.technicalSupport, value]
    }));
  };

  // Scroll to the first error field
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = Object.keys(validationErrors)[0];
      
      setTimeout(() => {
        switch (firstErrorField) {
          case 'companyName':
            companyNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            companyNameRef.current?.focus();
            break;
          case 'personName':
            personNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            personNameRef.current?.focus();
            break;
          case 'phone':
            phoneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            phoneRef.current?.focus();
            break;
          case 'email':
            emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            emailRef.current?.focus();
            break;
          default:
            break;
        }
      }, 100);
    }
  }, [validationErrors]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const requipurpleFields = ['companyName', 'personName', 'phone'];
    
    for (const field of requipurpleFields) {
      if (!formData[field as keyof FormData].toString().trim()) {
        const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
        errors[field] = `Please fill in the ${fieldName}`;
      }
    }

    // Email validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (formData.email && !emailRegex.test(formData.email)) {
    //   errors.email = 'Please enter a valid email address';
    // }

    // Phone validation
    const phoneRegex = /^[+]?[0-9\s-()]{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // const handleSubmit = async () => {
  //   if (!validateForm()) {
  //     setSubmitStatus('error');
  //     setMessage('Please fix the validation errors');
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setSubmitStatus('idle');

  //   try {
  //     const response1 = await fetch('/api/form', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(formData),
  //     });
  //     const response = await fetch('/api/send-mail', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(formData),
  //     });

  //     const result = await response.json();

  //     if (response.ok && result.success) {
  //       setSubmitStatus('success');
  //       setMessage('Form submitted successfully! Email has been sent.');
  //       setShowThankYou(true);
        
  //       // Reset form after successful submission
  //       setTimeout(() => {
  //         setFormData({
  //           companyName: '',
  //           personName: '',
  //           phone: '',
  //           email: '',
  //           make: '',
  //           model: '',
  //           technicalSupport: [],
  //           newMachineModel: '',
  //           eventName: '',
  //           remarks: ''
  //         });
  //         setSubmitStatus('idle');
  //         setMessage('');
  //         setValidationErrors({});
  //         setShowThankYou(false);
  //       }, 4000);
  //     } else {
  //       throw new Error(result.message || 'Failed to send email');
  //     }
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //     setSubmitStatus('error');
  //     setMessage('Error submitting form. Please try again.');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

const handleSubmit = async (e?: React.FormEvent) => {
  if (e) e.preventDefault(); // if you wrap inputs in <form onSubmit={handleSubmit}>

  if (!validateForm()) {
    setSubmitStatus('error');
    setMessage('Please fix the validation errors');
    return;
  }

  setIsSubmitting(true);
  setSubmitStatus('idle');
  setMessage('');

  try {
    // Send both requests in parallel
    const [saveRes, mailRes] = await Promise.all([
      fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }),
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }),
    ]);

    // Parse JSON safely
    const saveData = await saveRes.json().catch(() => ({}));
    const mailData = await mailRes.json().catch(() => ({}));

    if (saveRes.ok && mailRes.ok && saveData.success && mailData.success) {
      setSubmitStatus('success');
      setMessage('Form submitted successfully! Email has been sent.');
      setShowThankYou(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          companyName: '',
          personName: '',
          phone: '',
          email: '',
          make: '',
          model: '',
          technicalSupport: [],
          newMachineModel: '',
          eventName: '',
          remarks: ''
        });
        setSubmitStatus('idle');
        setMessage('');
        setValidationErrors({});
        setShowThankYou(false);
      }, 4000);
    } else {
      // Figure out which part failed
      let errorMsg = 'Form submission failed.';
      if (!saveRes.ok || !saveData.success) errorMsg = 'Failed to save form data.';
      else if (!mailRes.ok || !mailData.success) errorMsg = 'Failed to send email.';
      throw new Error(errorMsg);
    }
  } catch (error: any) {
    console.error('Error submitting form:', error);
    setSubmitStatus('error');
    setMessage(error.message || 'Error submitting form. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <>
      {/* Full Screen Thank You Message */}
     {showThankYou && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-purple-400 to-purple-600 flex items-center justify-center z-50 p-4">
          <div className="text-center text-white max-w-md mx-auto">
            <div className="mb-6">
              <CheckCircle className="w-24 h-24 mx-auto mb-4 animate-bounce" />
              <h1 className="text-4xl font-bold mb-2">Thank You!</h1>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <p className="text-lg mb-2">Form submitted successfully!</p>
              <p className="text-sm opacity-80 mt-4">Email has been sent to our team.</p>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="w-12 h-1 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

     <div className="min-h-screen bg-[url('/image.png')]  bg-cover bg-center py-4 sm:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
  {/* content here */}

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-10 blur-2xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Form with Glassmorphism Effect */}
        <div className="bg-transparent backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/20"></div>
          
          {/* Compact Header Section */}
          <div className="relative mb-6">
            {/* Logo and Event Info in Single Row */}
            <div className="flex items-center justify-between gap-3 mb-4">
              {/* Logo Section - Left Aligned */}
              <div className="flex-shrink-0">
                <img 
                  src="/logo.jpg" 
                  className="h-20 m:h-20 lg:h-24 w-auto object-contain drop-shadow-md" 
                  alt="Vajra Equipments Logo" 
                />
              </div>
              
              {/* Event Info - Right Aligned */}
              <div className="text-right">
                <h1 className="text-xs sm:text-base lg:text-lg font-bold text-purple-600 leading-tight">
                  INDIA CORR EXPO 2025
                </h1>
                <p className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-800 leading-tight">
                  STALL NO. C-15
                </p>
                <div className="flex flex-col sm:flex-row items-end sm:justify-end gap-1 sm:gap-3 text-xs sm:text-sm text-gray-600 mt-1">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1 text-purple-500" />
                    <span className="font-bold text-purple-600">11-12-13 SEP</span>
                  </div>
                  <span className="hidden sm:inline text-gray-400">|</span>
                  <span className="text-xs text-center sm:text-left">India Expo Centre, Greater Noida</span>
                </div>
              </div>
            </div>

            {/* Form Title */}
            <div className="text-center">
              {/* <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                Visitor Information Form
              </h3> */}
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
            </div>
          </div>
          
          <div className="relative space-y-5 lg:space-y-6">
            {/* Status Messages */}
            {submitStatus !== 'idle' && (
              <div className={`p-4 rounded-xl flex items-center space-x-3 ${
                submitStatus === 'success' 
                  ? 'bg-green-100 border border-green-300 text-green-800' 
                  : 'bg-purple-100 border border-purple-300 text-purple-800'
              }`}>
                {submitStatus === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="font-medium">{message}</span>
              </div>
            )}

            {/* Personal Information Section */}
            <div className="bg-white/50   backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-purple-400">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2 text-purple-500" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Company Name */}
                <div ref={companyNameRef}>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('companyName')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/60 backdrop-blur-sm border-2 rounded-lg focus:outline-none transition-all duration-300 text-sm ${
                        focusedField === 'companyName' 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-white/80' 
                          : validationErrors.companyName
                            ? 'border-purple-300 bg-purple-50/50'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Company Name *"
                      required
                    />
                    {validationErrors.companyName && (
                      <p className="text-purple-500 text-xs mt-1 ml-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {validationErrors.companyName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Person Name */}
                <div ref={personNameRef}>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-500" />
                    <input
                      type="text"
                      name="personName"
                      value={formData.personName}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('personName')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/60 backdrop-blur-sm border-2 rounded-lg focus:outline-none transition-all duration-300 text-sm ${
                        focusedField === 'personName' 
                          ? 'border-purple-500 shadow-lg shadow-purple-500/20 bg-white/80' 
                          : validationErrors.personName
                            ? 'border-purple-300 bg-purple-50/50'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Person Name *"
                      required
                    />
                    {validationErrors.personName && (
                      <p className="text-purple-500 text-xs mt-1 ml-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {validationErrors.personName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div ref={phoneRef}>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/60 backdrop-blur-sm border-2 rounded-lg focus:outline-none transition-all duration-300 text-sm ${
                        focusedField === 'phone' 
                          ? 'border-green-500 shadow-lg shadow-green-500/20 bg-white/80' 
                          : validationErrors.phone
                            ? 'border-purple-300 bg-purple-50/50'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Phone Number *"
                      required
                    />
                    {validationErrors.phone && (
                      <p className="text-purple-500 text-xs mt-1 ml-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {validationErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div ref={emailRef} className="sm:col-span-1">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/60 backdrop-blur-sm border-2 rounded-lg focus:outline-none transition-all duration-300 text-sm ${
                        focusedField === 'email' 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-white/80' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Email Address *"
                      
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Existing Machine Section */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-purple-400">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center">
                <Package className="w-4 h-4 mr-2 text-purple-500" />
                Existing Machine
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                {/* Make */}
                <div>
                  <div className="relative">
                    <Wrench className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-500" />
                    <input
                      type="text"
                      name="make"
                      value={formData.make}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('make')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/60 backdrop-blur-sm border-2 rounded-lg focus:outline-none transition-all duration-300 text-sm ${
                        focusedField === 'make' 
                          ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 bg-white/80' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Make / Manufacturer"
                    />
                  </div>
                </div>

                {/* Model */}
                <div>
                  <div className="relative">
                    <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-500" />
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('model')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/60 backdrop-blur-sm border-2 rounded-lg focus:outline-none transition-all duration-300 text-sm ${
                        focusedField === 'model' 
                          ? 'border-orange-500 shadow-lg shadow-orange-500/20 bg-white/80' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Model Number"
                    />
                  </div>
                </div>

                {/* Technical Support/Service/PP Role - Checkboxes */}
                <div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Settings className="w-4 h-4 mr-2 text-teal-500" />
                      Service Type
                    </label>
                    <div className="space-y-2">
                      {['Technical Support', 'Service', 'PP Role'].map((option) => (
                        <label key={option} className="flex items-center space-x-3 cursor-pointer group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={formData.technicalSupport.includes(option)}
                              onChange={() => handleCheckboxChange(option)}
                              className="w-4 h-4 text-teal-500 border-2 border-gray-300 rounded focus:ring-teal-500 focus:ring-2 transition-colors"
                            />
                          </div>
                          <span className="text-sm text-gray-700 group-hover:text-teal-600 transition-colors">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* New Machine Section */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-purple-400">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center">
                <Package className="w-4 h-4 mr-2 text-green-500" />
                New Machine
              </h3>
              <div className="grid grid-cols-1">
                {/* Models to be Listed */}
                <div>
                  <div className="relative">
                    <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500 z-10" />
                    <select
                      name="newMachineModel"
                      value={formData.newMachineModel}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('newMachineModel')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/60 backdrop-blur-sm border-2 rounded-lg focus:outline-none transition-all duration-300 text-sm appearance-none ${
                        focusedField === 'newMachineModel' 
                          ? 'border-green-500 shadow-lg shadow-green-500/20 bg-white/80' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <option value="">Select Machine Model</option>
                      <option value="Semi Auto Strapper">Semi Auto Strapper</option>
                      <option value="Fully Auto Strapper">Fully Auto Strapper</option>
                      <option value="Speed Strapper">Speed Strapper</option>
                      <option value="Heavy Duty Strapper">Heavy Duty Strapper</option>
                      <option value="Portable Strapper">Portable Strapper</option>
                      <option value="Custom Strapper">Custom Strapper</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Remarks Section */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-purple-400">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-pink-500" />
                Additional Information
              </h3>
              <div>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-pink-500" />
                  <textarea
                    name="remarks"
                    rows={3}
                    value={formData.remarks}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('remarks')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/60 backdrop-blur-sm border-2 rounded-lg focus:outline-none transition-all duration-300 resize-none text-sm ${
                      focusedField === 'remarks' 
                        ? 'border-pink-500 shadow-lg shadow-pink-500/20 bg-white/80' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Additional comments, requirements, or questions..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`group relative w-full font-bold py-3 sm:py-4 px-6 rounded-xl overflow-hidden transition-all duration-300 transform shadow-xl ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed scale-100'
                    : 'bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white hover:scale-[1.01] active:scale-[0.99] hover:shadow-purple-500/30'
                }`}
              >
                <div className={`absolute inset-0 transition-opacity duration-300 ${
                  isSubmitting ? 'bg-gray-500' : 'bg-gradient-to-r from-purple-600 to-purple-800 opacity-0 group-hover:opacity-100'
                }`}></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <Send className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                    isSubmitting ? 'animate-pulse' : 'group-hover:translate-x-1'
                  }`} />
                  <span className="text-sm sm:text-base">
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
          <div className="absolute top-4 right-4 w-24 lg:w-32 h-24 lg:h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-20 lg:w-24 h-20 lg:h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl"></div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 lg:mt-8">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-lg px-3 sm:px-4 lg:px-6 py-2 rounded-full border border-white/30">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-gray-600 text-xs sm:text-sm font-medium">© 2024  Vajra Equipments  - Powepurple by Innovation</p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}


