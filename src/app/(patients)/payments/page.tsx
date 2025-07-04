"use client";

import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import NavBar from "@/components/navbar";
import { authenticationService } from "@/services/auth.service";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Appointments } from "@/interfaces/appointment-user.interface";
import { Toaster, toast } from "sonner";

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

const Input = ({ name, type, placeholder, value, onChange }) => (
  <input
    name={name}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="flex h-10 w-full rounded-md border border-primary bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
  />
);

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

function luhnCheck(cardNumber: string) {
  let sum = 0;
  let shouldDouble = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export default function PaymentForm() {
  const [user, setUser] = React.useState(null);

  const [formData, setFormData] = React.useState({
    number: "",
    exp_month: "",
    exp_year: "",
    cvc: "",
    card_holder: "",
    amount_in_cents: 150000,
    currency: "COP",
    customer_email: "",
    reference: `order_${Date.now()}`,
    payment_method: {
      type: "CARD",
      installments: 1,
    },
  });

  const [fieldErrors, setFieldErrors] = React.useState({
    number: "",
    exp_month: "",
    exp_year: "",
    cvc: "",
    card_holder: "",
  });

  const [response, setResponse] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [bodyAppointment, setBodyAppointment] = React.useState({});
  const [responseAppointment, setResponseAppointment] =
    React.useState<Appointments | null>(null);
  const router = useRouter();

  const validatePaymentForm = () => {
    const { number, exp_month, exp_year, cvc, card_holder } = formData;
    let errorMsg = "";

    const cardNum = number.replace(/\s/g, "");
    if (!cardNum || !/^\d{16}$/.test(cardNum)) {
      errorMsg = "Número de tarjeta inválido. Debe contener 16 dígitos.";
    } else if (!luhnCheck(cardNum)) {
      errorMsg = "Número de tarjeta inválido.";
    } else if (!exp_month || !/^(0[1-9]|1[0-2])$/.test(exp_month)) {
      errorMsg = "Mes de expiración inválido. Use formato MM (01-12).";
    } else if (!exp_year || !/^\d{2}$/.test(exp_year)) {
      errorMsg = "Año de expiración inválido. Use formato AA (dos dígitos).";
    } else if (!cvc || !/^\d{3,4}$/.test(cvc)) {
      errorMsg = "CVC inválido. Debe contener 3 o 4 dígitos.";
    } else if (!card_holder.trim()) {
      errorMsg = "El nombre del titular es obligatorio.";
    }

    if (errorMsg) {
      toast.error(errorMsg);
      return false;
    }
    return true;
  };

  const validateField = (name: string, value: string) => {
    if (name === "number") {
      const cardNum = value.replace(/\s/g, "");
      if (!/^\d{16}$/.test(cardNum)) {
        return "Número de tarjeta inválido. Debe contener 16 dígitos.";
      } else if (!luhnCheck(cardNum)) {
        return "Número de tarjeta inválido. No supera la verificación de Luhn.";
      }
    } else if (name === "exp_month") {
      if (!/^(0[1-9]|1[0-2])$/.test(value)) {
        return "Mes de expiración inválido. Use formato MM (01-12).";
      }
    } else if (name === "exp_year") {
      if (!/^\d{2}$/.test(value)) {
        return "Año de expiración inválido. Use formato AA (dos dígitos).";
      }
    } else if (name === "cvc") {
      if (!/^\d{3,4}$/.test(value)) {
        return "CVC inválido. Debe contener 3 o 4 dígitos.";
      }
    } else if (name === "card_holder") {
      if (!value.trim()) {
        return "El nombre del titular es obligatorio.";
      }
    }
    return "";
  };

  const isPaymentFormValid = React.useMemo(() => {
    const { number, exp_month, exp_year, cvc, card_holder } = formData;
    return (
      !validateField("number", number) &&
      !validateField("exp_month", exp_month) &&
      !validateField("exp_year", exp_year) &&
      !validateField("cvc", cvc) &&
      !validateField("card_holder", card_holder)
    );
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const errorMsg = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const fetchUserDetails = async () => {
    try {
      const response = await authenticationService.userDetails();
      setUser(response);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchUserDetails();

    let storedData = localStorage.getItem("responses");
    let accessibilityType = "";
    let payment_cents = localStorage.getItem("payment_cents");

    if (payment_cents) {
      setFormData((prev) => ({
        ...prev,
        amount_in_cents: Number(payment_cents),
      }));
    }

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.type) {
          accessibilityType = parsedData.type.toLowerCase();
        }
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
      }
    }
    const body = localStorage.getItem("appointmentDetails");
    let parsedBody = body ? JSON.parse(body) : null;
    parsedBody.accesibility_type = accessibilityType;

    setBodyAppointment(parsedBody);
  }, []);

  React.useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        customer_email: user.email,
      }));
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!validatePaymentForm()) return;

    // Check if customer_email is set, if not try to get it from user object
    if (!formData.customer_email && user?.email) {
      setFormData((prev) => ({
        ...prev,
        customer_email: user.email,
      }));
      // Show error if no email is available
      if (!user?.email) {
        toast.error("El correo electrónico del usuario es requerido para el pago");
        return;
      }
    }

    setIsLoading(true);
    const token = Cookies.get("token");
    try {
      const appointmentResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bodyAppointment),
        }
      );

      const appointmentData = await appointmentResponse.json();
      if (!appointmentResponse.ok)
        throw new Error(
          appointmentData.message || "Failed to create appointment"
        );

      setResponseAppointment(appointmentData);

      // Make sure customer_email is included in payment request
      const paymentRequestData = {
        ...formData,
        appointment_id: appointmentData.appointment.id,
        customer_email: formData.customer_email || user?.email || "", // Ensure email is set
      };

      console.log("Payment data being sent:", paymentRequestData); // For debugging

      const paymentResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wompi/payment-card`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer pub_test_IqJy5M43H63iF8vLNh9JHJiM2vNZsEhg",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentRequestData),
        }
      );

      const paymentData = await paymentResponse.json();
      setIsLoading(false);

      if (paymentResponse.ok) {
        setResponse(paymentData);

        localStorage.removeItem("appointmentDetails");
        (
          document.getElementById("my_modal_5") as HTMLDialogElement
        ).showModal();
      } else {
        throw new Error(paymentData.message || "Failed to process payment");
      }
    } catch (error: any) {
      console.error("Error en la solicitud:", error);
      alert("Ocurrió un error: " + error.message);
    }
  };

  const handleHome = () => {
    (document.getElementById("my_modal_5") as HTMLDialogElement).close();
    router.push("/");
  };

  return (
    <>
      <NavBar />
      <Toaster />

      <div className="min-h-screen bg-white p-4 md:p-6 mt-12">
        <div className="mx-auto max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-primary">Pago</h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">
              Introduce la información de pago
            </h2>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-primary">
                  Tu método de pago
                </Label>
                <Select defaultValue="credit">
                  <SelectTrigger className="mt-1.5 w-full rounded-full border-primary bg-white px-4 py-6">
                    <SelectValue placeholder="Crédito/Débito" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit">Crédito/Débito</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2 flex gap-2">
                  <img src="/icons/visa-icon.png" className="w-14 h-6" />
                  <img src="/icons/master-icon.png" className="w-14 h-7" />
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <Input
                    name="number"
                    type="text"
                    placeholder="Número de tarjeta"
                    value={formData.number}
                    onChange={handleChange}
                  />
                  {fieldErrors.number && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldErrors.number}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      name="exp_month"
                      type="text"
                      placeholder="MM"
                      value={formData.exp_month}
                      onChange={handleChange}
                    />
                    {fieldErrors.exp_month && (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldErrors.exp_month}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      name="exp_year"
                      type="text"
                      placeholder="AA"
                      value={formData.exp_year}
                      onChange={handleChange}
                    />
                    {fieldErrors.exp_year && (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldErrors.exp_year}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Input
                    name="cvc"
                    type="text"
                    placeholder="CVC"
                    value={formData.cvc}
                    onChange={handleChange}
                  />
                  {fieldErrors.cvc && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldErrors.cvc}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    name="card_holder"
                    type="text"
                    placeholder="Nombre del titular"
                    value={formData.card_holder}
                    onChange={handleChange}
                  />
                  {fieldErrors.card_holder && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldErrors.card_holder}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            disabled={!isPaymentFormValid || isLoading}
            onClick={handleSubmit}
            className={`w-full h-12 rounded-full px-6 py-3 text-white shadow-lg transform transition-transform duration-300 ${
              !isPaymentFormValid || isLoading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 hover:scale-105"
            }`}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              <>Pagar</>
            )}
          </button>
        </div>
      </div>

      <dialog id="my_modal_5" className="modal modal-middle sm:modal-middle">
        <div className="modal-box flex flex-col items-center text-center p-6">
          <div className="text-blue-600 text-5xl">
            <i className="fas fa-check-circle"></i>
          </div>

          <img src="/icons/success.png" alt="Éxito" />
          <h3 className="font-bold text-2xl mt-4">
            Su pago se efectuó con éxito
          </h3>
          <p className="py-4 text-lg">
            Su cita quedó agendada para el día
            <strong>
              {" "}
              {responseAppointment?.appointment?.date?.toString() ??
                "Fecha no disponible"}{" "}
            </strong>
            , desde las
            <strong>
              {" "}
              {responseAppointment?.appointment?.start_time ??
                "Hora de inicio no disponible"}{" "}
            </strong>
            hasta las
            <strong>
              {" "}
              {responseAppointment?.appointment?.end_time ??
                "Hora de fin no disponible"}
            </strong>
            . Te estaremos informando el estado de pago de tu cita
          </p>
          <p className="text-base">
            Puedes ver tus citas en tu perfil de usuario y la opción de chat
            habilitada en el perfil del profesional.
          </p>
          <div className="modal-action mt-6">
            <button className="btn btn-primary" onClick={handleHome}>
              Volver al inicio
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
