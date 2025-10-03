import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = ({ 
  label, 
  error, 
  required = false,
  children,
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && <Label required={required}>{label}</Label>}
      {children || <Input error={error} {...props} />}
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;