// Payment method icon components with real branding
import { CreditCard, Banknote, Smartphone, Wallet, Globe } from 'lucide-react';

interface PaymentIconProps {
  className?: string;
}

export function ApplePayIcon({ className = "w-12 h-8" }: PaymentIconProps) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="black"/>
      <path d="M14.5 10.5c-.4.5-1.1.8-1.7.8-.1-.6.2-1.3.5-1.7.4-.5 1-.9 1.6-.9.1.6-.1 1.3-.4 1.8zm.4 1.3c-.9-.1-1.7.5-2.1.5s-1.1-.5-1.8-.5c-1 0-1.9.6-2.4 1.5-1 1.8-.3 4.4.7 5.8.5.7 1.1 1.5 3.2 1.5.7 0 1-.5 1.8-.5s1.1.5 1.9.5c.8 0 1.3-.7 1.8-1.4.6-.8.8-1.6.8-1.6s-1.6-.6-1.6-2.4c0-1.5 1.2-2.2 1.3-2.2h-.1zm7.6 8.7h-1.3l-.7-2.2h-2.5l-.7 2.2h-1.3l2.5-7.6h1.5l2.5 7.6zm-2.3-3.3l-.6-1.9c-.1-.2-.2-.7-.4-1.3h0c-.1.4-.2.9-.4 1.3l-.6 1.9h2zm8.3.8c0 1-.3 1.8-.8 2.3s-1.2.8-2 .8c-.9 0-1.5-.3-1.8-.9h0v3.3h-1.2v-6.8c0-.7 0-1.4-.1-2.1h1.1l.1.9h0c.5-.7 1.2-1 2.1-1 .8 0 1.4.3 1.9.9.5.6.7 1.4.7 2.4v.2zm-1.3 0c0-.6-.1-1.1-.4-1.5s-.7-.6-1.2-.6c-.3 0-.6.1-.9.3-.3.2-.5.4-.6.7-.1.2-.1.3-.1.5v1.2c0 .5.2.9.5 1.2.3.3.7.5 1.2.5.5 0 .9-.2 1.2-.6.3-.4.5-.9.5-1.6v-.1zm7.4 0c0 1-.3 1.8-.8 2.3s-1.2.8-2 .8c-.9 0-1.5-.3-1.8-.9h0v3.3h-1.2v-6.8c0-.7 0-1.4-.1-2.1h1.1l.1.9h0c.5-.7 1.2-1 2.1-1 .8 0 1.4.3 1.9.9.5.6.7 1.4.7 2.4v.2zm-1.3 0c0-.6-.1-1.1-.4-1.5s-.7-.6-1.2-.6c-.3 0-.6.1-.9.3-.3.2-.5.4-.6.7-.1.2-.1.3-.1.5v1.2c0 .5.2.9.5 1.2.3.3.7.5 1.2.5.5 0 .9-.2 1.2-.6.3-.4.5-.9.5-1.6v-.1zm2.7-3.5c0-.4.1-.7.3-.9.2-.2.4-.3.7-.3s.5.1.7.3c.2.2.3.5.3.9s-.1.7-.3.9c-.2.2-.4.3-.7.3s-.5-.1-.7-.3c-.2-.2-.3-.5-.3-.9zm1.5 6.8h-1.3v-5.7h1.3v5.7zm6.3-2.9c0 .9-.2 1.6-.7 2.2-.5.5-1.1.8-1.8.8-.8 0-1.4-.3-1.9-.8-.5-.5-.7-1.2-.7-2.1v-.1c0-.9.2-1.6.7-2.2.5-.6 1.1-.8 1.9-.8.8 0 1.4.3 1.8.8.5.5.7 1.2.7 2.1v.1zm-1.3 0c0-.6-.1-1-.3-1.4s-.6-.6-1-.6c-.5 0-.8.2-1.1.6s-.4.9-.4 1.5c0 .6.1 1 .3 1.4.3.4.6.6 1.1.6.4 0 .8-.2 1.1-.6.2-.4.3-.9.3-1.5z" fill="white"/>
    </svg>
  );
}

export function GooglePayIcon({ className = "w-12 h-8" }: PaymentIconProps) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="white" stroke="#E8E8E8"/>
      <path d="M23.5 15.3v3.5h-1.2v-8.5h3.2c.8 0 1.5.3 2 .8.5.5.8 1.2.8 1.9 0 .8-.3 1.4-.8 1.9-.5.5-1.2.8-2 .8h-2zm0-4.1v3h2c.5 0 .9-.2 1.2-.5.3-.3.5-.7.5-1.2s-.2-.9-.5-1.2c-.3-.3-.7-.5-1.2-.5h-2zm8.7 1.7c.8 0 1.4.2 1.9.7s.7 1.1.7 1.9v3.3h-1.1v-.8h0c-.5.6-1.1.9-1.9.9-.7 0-1.2-.2-1.7-.6-.4-.4-.7-.9-.7-1.5 0-.6.2-1.1.7-1.5.5-.4 1.1-.6 1.9-.6.6 0 1.2.1 1.6.4v-.3c0-.4-.2-.8-.5-1.1-.3-.3-.7-.4-1.1-.4-.6 0-1.1.3-1.5.8l-1-.6c.6-.8 1.5-1.2 2.6-1.2zm-1.5 4.6c0 .3.1.6.4.8.3.2.6.3.9.3.5 0 1-.2 1.4-.5.4-.3.6-.7.6-1.2-.4-.3-.9-.5-1.5-.5-.5 0-.9.1-1.2.3-.3.2-.5.5-.5.8h-.1zm6-4.5h1.2l2.1 5.4h0l2-5.4h1.2l-3.3 8.3h-1.1l1-2.6-2.3-5.7h.2z" fill="#3C4043"/>
      <path d="M19.2 13.9c0-.3 0-.6-.1-.9h-4.5v1.7h2.6c-.1.6-.5 1.1-1 1.4v1.1h1.6c.9-.8 1.4-2 1.4-3.3z" fill="#4285F4"/>
      <path d="M14.6 18.7c1.3 0 2.4-.4 3.2-1.2l-1.6-1.2c-.4.3-1 .5-1.6.5-1.2 0-2.3-.8-2.6-2h-1.7v1.2c.8 1.6 2.5 2.7 4.3 2.7z" fill="#34A853"/>
      <path d="M12 15.3c-.2-.6-.2-1.2 0-1.7v-1.2h-1.7c-.7 1.3-.7 2.8 0 4.1l1.7-1.2z" fill="#FBBC04"/>
      <path d="M14.6 12.3c.7 0 1.3.2 1.8.7l1.3-1.3c-.8-.8-1.9-1.2-3.1-1.2-1.8 0-3.5 1.1-4.3 2.7l1.7 1.2c.3-1.2 1.4-2 2.6-2z" fill="#EA4335"/>
    </svg>
  );
}

export function StripeLinkIcon({ className = "w-12 h-8" }: PaymentIconProps) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="#00D66F"/>
      <path d="M12 16c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zm8 0c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zm8 0c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z" fill="white"/>
    </svg>
  );
}

export function KlarnaIcon({ className = "w-12 h-8" }: PaymentIconProps) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="#FFB3C7"/>
      <path d="M14 10h2v12h-2V10zm4 0h2v5.5c.8-1 1.9-1.5 3.2-1.5 2.6 0 4.8 2.2 4.8 5s-2.2 5-4.8 5c-1.3 0-2.4-.5-3.2-1.5v1.2h-2V10zm5 10c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3z" fill="#000000"/>
    </svg>
  );
}

export function IdealIcon({ className = "w-12 h-8" }: PaymentIconProps) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="white" stroke="#E8E8E8"/>
      <path d="M16 11h2v10h-2V11zm5 0h6c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4v2h-2V11zm2 6h4c1.1 0 2-.9 2-2s-.9-2-2-2h-4v4zm8-6h6v2h-4v2h4v2h-4v2h4v2h-6V11z" fill="#CC0066"/>
    </svg>
  );
}

export function SepaIcon({ className = "w-12 h-8" }: PaymentIconProps) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="#003399"/>
      <path d="M12 15h2v2h-2v-2zm4-2h2v6h-2v-6zm4-2h2v10h-2V11zm4 3h2v5h-2v-5zm4-1h2v8h-2v-8zm4 2h2v4h-2v-4z" fill="#FFCC00"/>
    </svg>
  );
}

// Generic fallback icon
export function GenericCardIcon({ className = "w-6 h-6" }: PaymentIconProps) {
  return <CreditCard className={className} />;
}

export function CashIcon({ className = "w-6 h-6" }: PaymentIconProps) {
  return <Banknote className={className} />;
}

export function MobilePayIcon({ className = "w-6 h-6" }: PaymentIconProps) {
  return <Smartphone className={className} />;
}

export function WalletIcon({ className = "w-6 h-6" }: PaymentIconProps) {
  return <Wallet className={className} />;
}

export function OnlinePaymentIcon({ className = "w-6 h-6" }: PaymentIconProps) {
  return <Globe className={className} />;
}

// Main component to select the right icon
interface PaymentMethodIconProps {
  methodId: string;
  className?: string;
}

export function PaymentMethodIcon({ methodId, className = "w-12 h-8" }: PaymentMethodIconProps) {
  switch (methodId.toLowerCase()) {
    case 'online':
    case 'globe':
      return <OnlinePaymentIcon className={className} />;
    case 'apple_pay':
      return <ApplePayIcon className={className} />;
    case 'google_pay':
      return <GooglePayIcon className={className} />;
    case 'stripe_link':
    case 'link':
      return <StripeLinkIcon className={className} />;
    case 'klarna':
      return <KlarnaIcon className={className} />;
    case 'ideal':
      return <IdealIcon className={className} />;
    case 'sepa_debit':
    case 'sepa':
      return <SepaIcon className={className} />;
    case 'cash':
      return <CashIcon className={className} />;
    case 'card':
      return <GenericCardIcon className={className} />;
    case 'mobile':
      return <MobilePayIcon className={className} />;
    default:
      return <GenericCardIcon className={className} />;
  }
}
