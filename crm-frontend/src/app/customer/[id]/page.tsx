import CustomerDetail from "@/components/customer/customer-detail";

interface CustomerDetailPageProps {
  params: {
    id: string;
  };
}

export default function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  return <CustomerDetail customerId={params.id} />;
}
