import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Alert, ConfigProvider, Row, Image } from 'antd';
import Countdown from 'react-countdown';
import EmailIcon from '../../../assets/images/svgs/ic_email_forgotpassword.svg';

/**
 * Step 2: OTP Verification Form
 * User enters verification code and verifies account
 */
const StepOTP = ({
  username,
  expiredDate,
  sendDate,
  onVerify,
  onRequestNew,
  onBack,
  onExpired,
  showInput,
  showVerifyButton,
  showRequestButton,
  isLoading,
  error
}) => {
  const [otpValue, setOtpValue] = useState('');
  const [hasError, setHasError] = useState(false);
  const [form] = Form.useForm();

  // Reset error state when OTP value changes
  useEffect(() => {
    if (otpValue) {
      setHasError(false);
      form.setFields([{ name: 'otp', errors: [] }]);
    }
  }, [otpValue, form]);

  // Countdown renderer
  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      onExpired();
      return <span className="text-red-500 font-medium text-[22px]">00:00</span>;
    }
    return (
      <span className="text-blue-600 font-medium text-[22px]">
        {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </span>
    );
  };

  // Calculate countdown time
  const getCountdownDate = () => {
    const expireTime = new Date(expiredDate).getTime();
    const sendTime = new Date(sendDate).getTime();
    const remainingTime = expireTime - sendTime;
    return Date.now() + remainingTime;
  };

  const handleSubmit = () => {
    if (!otpValue || otpValue.trim() === '') {
      setHasError(true);
      form.setFields([
        { name: 'otp', errors: ['Please enter verification code'] }
      ]);
      return;
    }
    onVerify(otpValue);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadiusLG: 28,
          fontFamily: 'Roboto'
        }
      }}
    >
      <Card className="w-full max-w-[430px] mx-auto shadow-none rounded-3xl">
        {/* Title and Instructions */}
        <div className="text-center">
          <h4 className="text-[22px] font-medium mb-2.5 text-gray-800">
            Verify Your Account
          </h4>
          <p className="text-gray-500 mb-0">
            Please enter the verification code sent to
          </p>
          
          {/* Email Display */}
          <Row className="items-center justify-center mb-5">
            <Image 
              src={EmailIcon} 
              preview={false} 
              className="mb-1"
              alt="Email icon"
            />
            <p className="mx-1.5 my-0 font-medium text-blue-600">
              {username}
            </p>
          </Row>

          {/* Countdown Timer */}
          <div>
            <p className="text-gray-500 mb-0">Expire in</p>
            <Countdown 
              date={getCountdownDate()} 
              renderer={renderer}
              key={`${expiredDate}-${sendDate}`}
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message={error.message || 'Verification failed. Please try again.'}
            type="error"
            className="mt-5 text-center"
          />
        )}

        {/* OTP Form */}
        <Form form={form} onFinish={handleSubmit}>
          {showInput && (
            <Form.Item name="otp" className="mb-10">
              <Input
                type="number"
                id="id-verification-code-forgot-password"
                placeholder="Verification Code"
                className={`h-[60px] text-2xl tracking-[5px] text-center mt-5 rounded-lg ${
                  hasError ? 'border-red-500' : ''
                }`}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                autoComplete="off"
              />
            </Form.Item>
          )}

          {/* Action Buttons */}
          <div className="mt-8">
            {/* Verify Button */}
            {showVerifyButton && (
              <Button
                role="button"
                name="btn-verify-forgot-password"
                className="w-full h-12 font-medium rounded-md border-none mb-5"
                type="primary"
                htmlType="submit"
                loading={isLoading}
              >
                Verify
              </Button>
            )}

            {/* Request New Code Button */}
            {showRequestButton && (
              <Button
                role="button"
                name="btn-request-otp-forgot-password"
                className="w-full h-12 font-medium rounded-md border-none mb-5"
                type="primary"
                onClick={onRequestNew}
                loading={isLoading}
              >
                Request Verification Code
              </Button>
            )}

            {/* Back Button */}
            <div className="text-center mt-5">
              <button
                type="button"
                name="btn-back-forgot-password"
                className="font-medium text-blue-600 hover:text-blue-700 bg-transparent border-none cursor-pointer"
                onClick={onBack}
              >
                Back
              </button>
            </div>
          </div>
        </Form>
      </Card>
    </ConfigProvider>
  );
};

export default StepOTP;
