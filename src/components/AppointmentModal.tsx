"use client";

import { Calendar, ChevronRight, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AppointmentModal = ({
  isOpen,
  onClose,
  doctor,
  selectedUserProfessional,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [timeOptions, setTimeOptions] = useState([]);
  const [totalCost, setTotalCost] = useState("");
  const [totalCents, setTotalCents] = useState("");
  const isAppointmentIncomplete = !selectedDate || !startTime || !endTime;
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = 26990;
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  const router = useRouter();

  if (!isOpen) return null;

  const startDate = startOfWeek(startOfMonth(currentMonth), {
    weekStartsOn: 0,
  });
  const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const getTimeslots = (availableFrom, availableTo) => {
    const start = new Date(`1970-01-01T${availableFrom}Z`);
    const end = new Date(`1970-01-01T${availableTo}Z`);
    const slots = [];

    while (start <= end) {
      const hours = start.getUTCHours();
      const formattedHour = `${hours}:00`;
      slots.push(formattedHour);
      start.setUTCHours(start.getUTCHours() + 1);
    }

    if (slots[slots.length - 1] !== `${end.getUTCHours()}:00`) {
      slots.pop();
    }

    return slots;
  };

  const handleDateClick = async (day) => {
    setSelectedDate(day);
    setIsCalendarOpen(false);

    const formattedDate = format(day, "yyyy-MM-dd");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/availabilities/health-professional-by-date/${selectedUserProfessional}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date: formattedDate }),
        }
      );

      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.status}`);

      const json = await response.json();

      if (!json || !Array.isArray(json))
        throw new Error("Invalid data received from the API");

      const blocks = getTimeBlocks(json);
      setTimeOptions(blocks);
    } catch (error) {
      console.error("Error fetching available times:", error);
      setTimeOptions([]);
    }
  };

  useEffect(() => {
    console.log(timeOptions);
  }, [timeOptions]);

  const getTimeBlocks = (appointments) => {
    let timeBlocks = [];

    appointments.forEach(({ available_from, available_to }) => {
      const start = new Date(`1970-01-01T${available_from}Z`);
      const end = new Date(`1970-01-01T${available_to}Z`);
      let block = [];

      while (start < end) {
        const hours = start.getUTCHours();
        const formattedHour = `${hours}:00`;
        if (!block.includes(formattedHour)) {
          block.push(formattedHour);
        }
        start.setUTCHours(start.getUTCHours() + 1);
      }

      if (
        end.getUTCMinutes() === 0 &&
        !block.includes(`${end.getUTCHours()}:00`)
      ) {
        block.push(`${end.getUTCHours()}:00`);
      }

      timeBlocks.push(block);
    });

    return timeBlocks;
  };

  const handleStartTimeChange = (e) => {
    const selectedTime = e.target.value;
    setStartTime(selectedTime);

    const selectedBlock = timeOptions.find((block) =>
      block.includes(selectedTime)
    );

    if (selectedBlock) {
      const validEndTimes = selectedBlock.filter(
        (time) => parseInt(time) > parseInt(selectedTime)
      );

      if (validEndTimes.length > 0) {
        setEndTime(validEndTimes[0]);
      } else {
        setEndTime("");
      }
    }
  };

  const handleCostByAppoiontment = async () => {
    let start = startTime.replace(/(AM|PM)/gi, "").trim();
    let end = endTime.replace(/(AM|PM)/gi, "").trim();

    const formatTimeTo24Hour = (time) => {
      const isAmPmFormat = time.match(/\s(AM|PM)$/i);

      if (isAmPmFormat) {
        const [hour, minute, period] = time.match(/(\d+):(\d+) (\w+)/).slice(1);
        let hour24 = parseInt(hour, 10);
        if (period.toUpperCase() === "PM" && hour24 !== 12) {
          hour24 += 12;
        } else if (period.toUpperCase() === "AM" && hour24 === 12) {
          hour24 = 0;
        }
        return `${hour24.toString().padStart(2, "0")}:${minute}`;
      } else {
        const [hour, minute] = time.split(":");
        return `${hour.padStart(2, "0")}:${minute}`;
      }
    };

    start = formatTimeTo24Hour(start);
    end = formatTimeTo24Hour(end);

    if (!start || !end) {
      console.error("Start time or end time is invalid");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/cost-by-appointment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            start_time: start,
            end_time: end,
            health_professional_id: selectedUserProfessional,
          }),
        }
      );

      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.status}`);

      const json = await response.json();

      setTotalCost(json.total_cost);
      setTotalCents(json.total_cents);

      console.log(json);
    } catch (error) {
      console.error("Error fetching available times:", error);
      setTimeOptions([]);
    }
  };

  useEffect(() => {
    if (startTime && endTime) {
      handleCostByAppoiontment();
    }
  }, [startTime, endTime]);

  const handleRegisterPage = () => {
    setIsLoading(true);
    console.log(
      `Fecha: ${selectedDate}, Inicio: ${startTime}, Fin: ${endTime}, Total: ${total}`
    );

    const token = Cookies.get("token");

    const formatTimeTo24Hour = (time) => {
      const isAmPmFormat = time.match(/\s(AM|PM)$/i);

      if (isAmPmFormat) {
        const [hour, minute, period] = time.match(/(\d+):(\d+) (\w+)/).slice(1);
        let hour24 = parseInt(hour, 10);
        if (period.toUpperCase() === "PM" && hour24 !== 12) {
          hour24 += 12;
        } else if (period.toUpperCase() === "AM" && hour24 === 12) {
          hour24 = 0;
        }
        return `${hour24.toString().padStart(2, "0")}:${minute}`;
      } else {
        const [hour, minute] = time.split(":");
        return `${hour.padStart(2, "0")}:${minute}`;
      }
    };

    const appointmentDetails = {
      health_professional_id: doctor,
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
      start_time: formatTimeTo24Hour(startTime),
      end_time: formatTimeTo24Hour(endTime),
    };

    localStorage.setItem("payment_cents", totalCents);

    localStorage.setItem(
      "appointmentDetails",
      JSON.stringify(appointmentDetails)
    );

    setIsLoading(false);
    if (token) {
      router.push("/payments");
    } else {
      router.push("/authentication");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold text-primary text-center">
            Fecha de la Cita
          </h2>
        </div>

        <div className="p-4 border-b">
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="flex items-center gap-2 w-full px-4 py-3 border rounded-lg text-left text-primary font-medium bg-white shadow-lg hover:bg-gray-100"
          >
            <Calendar className="w-5 h-5" />
            <span>
              {selectedDate
                ? format(selectedDate, "dd.MM.yyyy")
                : "Seleccionar un día"}
            </span>
            <ChevronRight className="w-5 h-5 ml-auto" />
          </button>
        </div>

        {isCalendarOpen && (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                {"<"}
              </button>
              <h3 className="font-medium">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                {">"}
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-sm mb-2">
              {["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"].map((day) => (
                <div key={day} className="text-center font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDateClick(day)}
                    className={`aspect-square rounded-full flex items-center justify-center text-sm ${
                      isSelected
                        ? "bg-primary text-white"
                        : isCurrentMonth
                        ? "hover:bg-gray-100"
                        : "text-gray-400"
                    }`}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-4 border-b">
          {timeOptions.length > 0 ? (
            <button
              onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
              className="flex items-center gap-2 w-full px-4 py-3 border rounded-lg text-left text-primary font-medium bg-white shadow-lg hover:bg-gray-100"
            >
              <Clock className="w-5 h-5" />
              <span>{`Hora: ${startTime || "Seleccionar"} - ${
                endTime || "Seleccionar"
              }`}</span>
              <ChevronRight className="w-5 h-5 ml-auto" />
            </button>
          ) : (
            <label className="text-sm font-semibold text-gray-700">
              No se encontraron disponibilidades para esta fecha
            </label>
          )}
        </div>

        {isTimePickerOpen &&
          (timeOptions.length > 0 ? (
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Hora de inicio
                </label>
                <select
                  value={startTime}
                  onChange={handleStartTimeChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium bg-white focus:ring-primary focus:border-primary transition-all"
                >
                  <option value="" disabled>
                    Seleccionar hora de inicio
                  </option>
                  {timeOptions.flat().map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Hora de fin
                </label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium bg-white focus:ring-primary focus:border-primary transition-all"
                  disabled={!startTime}
                >
                  <option value="" disabled>
                    Seleccionar hora de fin
                  </option>
                  {(
                    timeOptions
                      .find((block) => block.includes(startTime))
                      ?.filter(
                        (time: string) => parseInt(time) > parseInt(startTime)
                      ) ?? []
                  ).map((time: string) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <label className="text-sm font-semibold text-gray-700">
                No se encontraron disponibilidades para esta fecha
              </label>
            </div>
          ))}

        {totalCost && (
          <>
            <div className="p-4 space-y-2 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">COP ${totalCost}</span>
              </div>
              {/* <div className="flex justify-between text-sm">
            <span className="text-gray-600">IVA 19%</span>
            <span className="font-medium">COP ${iva.toLocaleString()}</span>
          </div> */}
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>COP ${totalCost}</span>
              </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-4 p-4 border-t">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-full border-2 border-primary text-primary font-medium hover:bg-blue-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => handleRegisterPage()}
            disabled={isAppointmentIncomplete}
            className={`py-1 px-2 rounded-full font-medium transition-colors ${
              isAppointmentIncomplete
                ? "bg-gray-300 disabled:text-gray-500 cursor-not-allowed"
                : "bg-primary text-white hover:bg-blue-700"
            }`}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-md"></span>
              </>
            ) : (
              <>
                <label className="text-sm">Agendar y pagar</label>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
