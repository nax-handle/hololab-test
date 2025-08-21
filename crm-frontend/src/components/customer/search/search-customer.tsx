import { Input } from "@/components/ui/input";
import { useSearchCustomer } from "@/hooks/use-customer";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";
import UserItem from "./user-item";
import { Search } from "lucide-react";
import { RadioGroup } from "@/components/ui/radio-group";
interface SearchCustomersProps {
  onChange: (_id: string) => void;
}
export default function SearchCustomer({ onChange }: SearchCustomersProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);
  const { isLoading, data: customers } = useSearchCustomer(debouncedSearch);
  return (
    <div className="space-y-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          className="pl-8"
          type="text"
          placeholder="Search customer by id, name, email or phone"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {isLoading && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          Searching customers...
        </div>
      )}
      {customers && customers.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground mb-2">
            Found {customers.length} customer(s)
          </div>
          <RadioGroup
            defaultValue={customers[0]._id}
            onValueChange={(value) => onChange(value)}
            className="space-y-2 overflow-y-scroll max-h-[150px]"
          >
            {customers.map((customer) => (
              <UserItem key={customer._id} user={customer} />
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  );
}
