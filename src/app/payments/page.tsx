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
import { backendService } from "@/services/backend.service";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Appointments } from "@/interfaces/appointment-user.interface";

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
// Input Component
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

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

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

  const [response, setResponse] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [bodyAppointment, setBodyAppointment] = React.useState({});
  const [responseAppointment, setResponseAppointment] =
    React.useState<Appointments | null>(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "installments" && {
        payment_method: { ...prev.payment_method, installments: Number(value) },
      }),
    }));
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
    console.log("Este es el user que llega del servidor", user);

    setFormData((prev) => ({
      ...prev,
      customer_email: user?.email,
    }));
  }, [user]);

  React.useEffect(() => {
    console.log("Pendientes, este es el cuerpo del pago", formData);
  }, [formData]);

  const handleSubmit = async () => {
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

      console.log(appointmentData);

      setResponseAppointment(appointmentData);

      const paymentResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wompi/payment-card`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer pub_test_IqJy5M43H63iF8vLNh9JHJiM2vNZsEhg",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            appointment_id: appointmentData.appointment.id,
          }),
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
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Ocurrió un error: " + error.message);
    }
  };

  React.useEffect(() => {
    if (responseAppointment) {
      console.log(responseAppointment.appointment);
    }
  }, [responseAppointment]);

  const handleHome = () => {
    (document.getElementById("my_modal_5") as HTMLDialogElement).close();
    router.push("/");
  };

  return (
    <>
      <NavBar></NavBar>

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
                  {/* <Image
                  src="/icons/master-icon.png"
                  alt="Visa"
                  width={40}
                  height={25}
                  className="h-6 w-auto object-contain"
                /> */}
                  {/* <Image
                  src="/icons/visa-icon.png"
                  alt="Mastercard"
                  width={40}
                  height={25}
                  className="h-6 w-auto object-contain"
                /> */}
                  <img src="/icons/visa-icon.png" className="w-14 h-6"></img>
                  <img src="/icons/master-icon.png" className="w-14 h-7"></img>
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="exp_month"
                    type="text"
                    placeholder="MM"
                    value={formData.exp_month}
                    onChange={handleChange}
                  />
                  <Input
                    name="exp_year"
                    type="text"
                    placeholder="AA"
                    value={formData.exp_year}
                    onChange={handleChange}
                  />
                </div>
                <Input
                  name="cvc"
                  type="text"
                  placeholder="CVC"
                  value={formData.cvc}
                  onChange={handleChange}
                />
                <Input
                  name="card_holder"
                  type="text"
                  placeholder="Nombre del titular"
                  value={formData.card_holder}
                  onChange={handleChange}
                />
              </div>

              {/* <div>
                <h3 className="mb-2 text-sm text-primary">Datos opcionales</h3>
                <Input
                  type="text"
                  placeholder="NN"
                  className="rounded-full border-primary px-4 py-6"
                />
              </div> */}
            </div>
          </div>

          <button
            className="w-full h-12 rounded-full bg-primary px-6 py-3 text-white hover:bg-primary/90 shadow-lg transform transition-transform duration-300 hover:scale-105"
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-md"></span>
              </>
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

          <img src="/icons/success.png"></img>
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
