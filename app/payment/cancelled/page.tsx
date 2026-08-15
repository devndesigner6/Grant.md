import { redirect } from "next/navigation";

// Legacy compatibility route retained so old links reach the normal product.
export default function PaymentCancelledPage() {
  redirect("/");
}
