import { Customer } from "@/types";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export interface UserItemProps {
  user: Customer;
}
export default function UserItem({ user }: UserItemProps) {
  return (
    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
      <RadioGroupItem value={user._id} id={user._id} />
      <Label htmlFor={user._id} className="flex-1 cursor-pointer">
        <div className="flex flex-col space-y-1">
          <div className="text-sm font-medium">{user.fullName}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
          <div className="text-xs text-muted-foreground">{user.phone}</div>
        </div>
      </Label>
    </div>
  );
}
