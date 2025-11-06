import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Alert, ConfigProvider } from 'antd';

/**
 * Step 1: Username Input Form
 * User enters username to receive verification code
 */
const StepUsername = ({ 
  onSubmit, 
  onBack, 
  isLoading, 
  error 
}) => {
  const [username, setUsername] = useState('');
  const [form] = Form.useForm();

  // Reset error when username changes
  useEffect(() => {
    if (username) {
      form.setFields([{ name: 'username', errors: [] }]);
    }
  }, [username, form]);

  const handleSubmit = () => {
    if (!username || username.trim() === '') {
      form.setFields([
        { name: 'username', errors: ['Please enter your username'] }
      ]);
      return;
    }
    onSubmit(username);
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
        {/* Title */}
        <div className="text-center mb-5">
          <h4 className="text-[22px] font-medium mb-2.5 text-gray-800">
            Forgot Password
          </h4>
          <p className="text-gray-500 mb-0">
            Enter your username to receive a verification code
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message={error.message || 'Invalid username. Please try again.'}
            type="error"
            className="mb-5 text-center"
          />
        )}

        {/* Form */}
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name="username" className="mb-10">
            <Input
              id="id-username-forgot-password"
              placeholder="Username"
              className="h-[60px] text-base"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
          </Form.Item>

          {/* Submit Button */}
          <div className="mb-5">
            <Button
              role="button"
              name="btn-request-code-forgot-password"
              className="w-full h-12 font-medium rounded-md border-none"
              type="primary"
              htmlType="submit"
              loading={isLoading}
            >
              Request Verification Code
            </Button>
          </div>

          {/* Back to Login Link */}
          <div className="text-center">
            <button
              type="button"
              name="btn-back-to-login"
              className="font-medium text-blue-600 hover:text-blue-700 bg-transparent border-none cursor-pointer"
              onClick={onBack}
            >
              Back
            </button>
          </div>
        </Form>
      </Card>
    </ConfigProvider>
  );
};

export default StepUsername;
