import React, { useState } from 'react';
import { Save, Bell, CreditCard, Globe, Shield, Users, Palette, ShoppingCart } from 'lucide-react';

const SettingsView = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      storeName: 'Natgas Store',
      storeEmail: 'info@natgasuganda.com',
      currency: 'UGX',
      timezone: 'East Africa/Kampala',
    },
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      lowStockAlerts: true,
      marketingEmails: false,
    },
    payment: {
      stripeEnabled: true,
      paypalEnabled: false,
      cashOnDelivery: true,
    },
    shipping: {
      freeShippingThreshold: 50,
      domesticRate: 5.99,
      internationalRate: 24.99,
    }
  });

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
 
  const saveSettings = () => {
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: ShoppingCart },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'users', label: 'Users & Permissions', icon: Users },
  ];

  const renderGeneralSettings = () => (
    <div className="container-fluid space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Store Name</label>
        <input
          type="text"
          value={settings.general.storeName}
          onChange={(e) => handleChange('general', 'storeName', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Store Email</label>
        <input
          type="email"
          value={settings.general.storeEmail}
          onChange={(e) => handleChange('general', 'storeEmail', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Currency</label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleChange('general', 'currency', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="UGX">UGX (USh)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Timezone</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleChange('general', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      {Object.entries(settings.notifications).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <div>
            <p className="font-medium">{key.split(/(?=[A-Z])/).join(' ')}</p>
            <p className="text-sm text-gray-500">Receive notifications for {key}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleChange('notifications', key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5] after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Stripe Payments</p>
          <p className="text-sm text-gray-500">Accept credit card payments via Stripe</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.payment.stripeEnabled}
            onChange={(e) => handleChange('payment', 'stripeEnabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">PayPal</p>
          <p className="text-sm text-gray-500">Accept PayPal payments</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.payment.paypalEnabled}
            onChange={(e) => handleChange('payment', 'paypalEnabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Cash on Delivery</p>
          <p className="text-sm text-gray-500">Allow cash on delivery payments</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.payment.cashOnDelivery}
            onChange={(e) => handleChange('payment', 'cashOnDelivery', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button 
          onClick={saveSettings}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="bg-white rounded-xl shadow">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 border-l-4 ${
                    activeTab === tab.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-6 capitalize">
              {activeTab} Settings
            </h2>
            
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'payment' && renderPaymentSettings()}
            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Free Shipping Threshold (USh) </label>
                  <input
                    type="number"
                    value={settings.shipping.freeShippingThreshold}
                    onChange={(e) => handleChange('shipping', 'freeShippingThreshold', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Domestic Shipping Rate (USh) </label>
                    <input
                      type="number"
                      value={settings.shipping.domesticRate}
                      onChange={(e) => handleChange('shipping', 'domesticRate', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">International Shipping Rate (USh) </label>
                    <input
                      type="number"
                      value={settings.shipping.internationalRate}
                      onChange={(e) => handleChange('shipping', 'internationalRate', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;