export type NoonEnvironment = "test" | "live";

export interface NoonConfig {
  mode: NoonEnvironment;
  businessId: string;
  appId: string;
  appKey: string;
  webhookKey?: string;
  baseUrl: string;
  returnUrl?: string;
}

export type OrderInternalStatus = "pending" | "paid" | "failed" | "cancelled";

export type PaymentInternalStatus =
  | "initiated"
  | "authenticated"
  | "authorized"
  | "captured"
  | "failed"
  | "cancelled"
  | "pending";

export type NoonApiOrderStatus =
  | "INITIATED"
  | "AUTHENTICATED"
  | "PAID"
  | "AUTHORIZED"
  | "CAPTURED"
  | "FAILED"
  | "EXPIRED"
  | "CANCELLED"
  | "REVERSED"
  | "REFUNDED"
  | "PENDING";

export interface NoonInitiateOrderPayload {
  apiOperation: "INITIATE";
  order: {
    amount: number;
    currency: string;
    name: string;
    reference: string;
    category?: string;
    channel?: string;
    description?: string;
  };
  configuration: {
    paymentAction: "AUTHORIZE" | "SALE";
    returnUrl: string;
    tokenizeCc?: boolean;
    locale?: "en" | "ar";
  };
  customer?: {
    id?: string;
    email?: string;
    name?: string;
    phone?: string;
  };
  billing?: {
    contact?: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      mobilePhone?: string;
      email?: string;
    };
    address?: {
      street?: string;
      city?: string;
      country?: string;
    };
  };
}

export interface NoonApiResponse<T = unknown> {
  resultCode: number;
  message: string;
  resultClass?: number;
  classDescription?: string;
  actionHint?: string;
  requestReference?: string;
  result?: T;
}

export interface NoonInitiateResult {
  order: {
    id: number | string;
    status: NoonApiOrderStatus;
    creationTime?: string;
    totalAmount?: number;
    currency?: string;
  };
  checkoutData?: {
    postUrl: string;
    jsUrl?: string;
    cancelUrl?: string;
  };
  nextActions?: string;
}

export interface NoonGetOrderResult {
  order: {
    id: number | string;
    status: NoonApiOrderStatus;
    creationTime?: string;
    amount?: number;
    currency?: string;
    name?: string;
    reference?: string;
    channel?: string;
  };
  transactions?: Array<{
    type: string;
    status: string;
    amount: number;
    currency: string;
    creationTime: string;
  }>;
  paymentDetails?: {
    instrument?: string;
    cardType?: string;
    cardNumber?: string;
    cardExpiryMonth?: string;
    cardExpiryYear?: string;
    cardHolderName?: string;
  };
}
