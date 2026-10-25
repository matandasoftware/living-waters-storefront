-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "subscriptionCode" TEXT NOT NULL,
    "paystackCustomerCode" TEXT,
    "paystackEmailToken" TEXT,
    "planCode" TEXT,
    "subscriptionType" TEXT,
    "subscriptionPlan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "nextBillingDate" TIMESTAMP(3),
    "lastPaymentReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "eventKey" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_subscriptionCode_key" ON "Subscription"("subscriptionCode");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_eventKey_key" ON "WebhookEvent"("eventKey");
