import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { BusSchedule, PassengerBooking } from '../../lib/mockData';
import { useData } from '../../context/DataContext';

interface BusBookingModalProps {
  schedule: BusSchedule;
  mode: 'PASSENGER' | 'CARGO';
  onClose: () => void;
}

export const BusBookingModal: React.FC<BusBookingModalProps> = ({
  schedule,
  mode,
  onClose
}) => {
  const navigate = useNavigate();
  const { bookBusTicket, bookBusCargo } = useData();

  // Booking step state:
  // 'confirm' -> 'payment' -> 'processing' -> 'success' -> 'ticket'
  const [step, setStep] = useState<'confirm' | 'payment' | 'processing' | 'success' | 'ticket'>('confirm');

  // Passenger Form State
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking'>('UPI');
  const [upiId, setUpiId] = useState<string>('citizen@okhdfcbank');
  const [cardNumber, setCardNumber] = useState<string>('4532 8901 2345 8821');
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [cardCvv, setCardCvv] = useState<string>('784');
  const [cardName, setCardName] = useState<string>('Kopargaon Citizen');
  const [selectedBank, setSelectedBank] = useState<string>('State Bank of India');
  const [confirmedBooking, setConfirmedBooking] = useState<PassengerBooking | null>(null);

  // Cargo Form State
  const [cargoWeight, setCargoWeight] = useState<number>(Math.min(25, schedule.availableCargoKg || 25));
  const [goodsType, setGoodsType] = useState<string>('Fresh Agri Produce (Pomegranates/Grapes)');
  const [senderName, setSenderName] = useState<string>('Kopargaon Local Farmer / Citizen');
  const [senderPhone, setSenderPhone] = useState<string>('+91 98220 12345');
  const [pickupNote, setPickupNote] = useState<string>(schedule.origin);
  const [dropNote, setDropNote] = useState<string>(schedule.destination);
  const [confirmedCargo, setConfirmedCargo] = useState<any>(null);

  const totalFare = passengerCount * schedule.fare;
  const totalCargoFare = cargoWeight * schedule.cargoRatePerKg;

  // Body Scroll Lock & ESC Key Listener (Requirement Step 9 & 11)
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step !== 'processing') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, step]);

  // Execute Payment Simulation
  const handleExecutePayment = () => {
    setStep('processing');

    setTimeout(() => {
      const booking = bookBusTicket({
        busNumber: schedule.busNumber,
        routeId: schedule.routeId,
        origin: schedule.origin,
        destination: schedule.destination,
        stops: schedule.stops,
        date: schedule.date,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        passengerCount,
        farePerPassenger: schedule.fare,
        totalAmount: totalFare,
        paymentMethod,
        userName: 'Kopargaon Citizen'
      });

      setConfirmedBooking(booking);
      setStep('success');
    }, 1200);
  };

  // Execute Cargo Booking
  const handleExecuteCargo = () => {
    setStep('processing');

    setTimeout(() => {
      const shipment = bookBusCargo({
        scheduleId: schedule.id,
        busNumber: schedule.busNumber,
        route: `${schedule.origin} → ${schedule.destination}`,
        weightKg: cargoWeight,
        ratePerKg: schedule.cargoRatePerKg,
        totalCharge: totalCargoFare,
        senderName,
        senderPhone,
        goodsType,
        pickupLocation: pickupNote,
        dropLocation: dropNote
      });

      setConfirmedCargo(shipment);
      setStep('success');
    }, 1200);
  };

  // Download / Print Ticket File
  const handleDownloadTicket = () => {
    if (!confirmedBooking) return;

    const ticketContent = `
============================================================
              KOPARGAON CONNECT SMART MOBILITY
                 OFFICIAL MSRTC E-TICKET
============================================================
Booking ID      : ${confirmedBooking.bookingId}
Transaction ID  : ${confirmedBooking.transactionId}
Date & Time     : ${confirmedBooking.bookedAt}
Status          : ${confirmedBooking.bookingStatus} (PAID)
------------------------------------------------------------
Bus Number      : ${confirmedBooking.busNumber}
Route           : ${confirmedBooking.origin} → ${confirmedBooking.destination}
Journey Date    : ${confirmedBooking.date}
Departure Time  : ${confirmedBooking.departureTime}
Arrival Time    : ${confirmedBooking.arrivalTime}
Passengers      : ${confirmedBooking.passengerCount} Seat(s)
------------------------------------------------------------
Fare Per Seat   : ₹${confirmedBooking.farePerPassenger}
Total Paid      : ₹${confirmedBooking.totalAmount}
Payment Method  : ${confirmedBooking.paymentMethod}
Passenger Name  : ${confirmedBooking.userName}
============================================================
Valid for travel on Kopargaon Smart Rural Transit Network.
Please show this ticket along with a valid ID during transit.
============================================================
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KopargaonConnect_Ticket_${confirmedBooking.bookingId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Portal to document.body (Requirement Step 2)
  return createPortal(
    <div
      className="fixed inset-0 w-screen h-screen z-[9998] flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      style={{ margin: 0 }}
      onClick={() => {
        if (step !== 'processing') onClose();
      }}
    >
      <div
        className="relative z-[9999] bg-white rounded-3xl shadow-2xl border border-[#cbc4d2]/60 w-[calc(100vw-24px)] sm:w-[calc(100%-40px)] max-w-[520px] max-h-[calc(100vh-24px)] sm:max-h-[calc(100vh-40px)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===================================================================== */}
        {/* CARGO BOOKING FLOW                                                    */}
        {/* ===================================================================== */}
        {mode === 'CARGO' ? (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-[#fdf7ff] shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#4f378a] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                </span>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-[#1d1b20]">Book Bus Cargo Bay Space</h3>
                  <span className="text-[11px] text-gray-500 font-semibold">{schedule.busNumber} • {schedule.origin} → {schedule.destination}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors"
                title="Close"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              {step === 'processing' ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-10 h-10 border-3 border-[#4f378a] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <h4 className="font-extrabold text-sm text-[#1d1b20]">Reserving Cargo Space...</h4>
                  <p className="text-gray-500 text-xs">Allocating bus cargo bay and generating shipment tracking code.</p>
                </div>
              ) : step === 'success' && confirmedCargo ? (
                <div className="space-y-4 text-center py-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Cargo Bay Reserved</span>
                    <h4 className="text-lg font-black text-[#1d1b20] mt-0.5">Shipment #{confirmedCargo.trackingNumber || 'KC-2026-77890'}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Your {cargoWeight} kg cargo allocation aboard {schedule.busNumber} is confirmed.
                    </p>
                  </div>

                  <div className="bg-[#f8f2fa] p-3.5 rounded-2xl border border-[#e1d4fd] text-xs text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Route:</span>
                      <strong className="text-[#1d1b20]">{schedule.origin} → {schedule.destination}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Goods Type:</span>
                      <strong className="text-[#1d1b20]">{goodsType}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Allocated Weight:</span>
                      <strong className="text-[#1d1b20]">{cargoWeight} kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cargo Rate:</span>
                      <strong className="text-[#1d1b20]">₹{schedule.cargoRatePerKg} / kg</strong>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-purple-200 text-sm font-bold text-[#4f378a]">
                      <span>Total Freight Charge:</span>
                      <span>₹{totalCargoFare}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Departure Schedule</span>
                      <strong className="text-[#1d1b20]">{schedule.departureTime} Today</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Available Cargo Space</span>
                      <strong className="text-emerald-700 font-black">{schedule.availableCargoKg} kg Available</strong>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Cargo Weight (kg)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={5}
                        max={schedule.availableCargoKg || 50}
                        step={5}
                        value={cargoWeight}
                        onChange={(e) => setCargoWeight(Number(e.target.value))}
                        className="flex-1 accent-[#4f378a]"
                      />
                      <span className="px-3 py-1.5 bg-[#f8f2fa] font-extrabold text-[#4f378a] rounded-xl border border-[#e1d4fd] text-xs shrink-0">
                        {cargoWeight} kg
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Goods Description</label>
                    <input
                      type="text"
                      value={goodsType}
                      onChange={(e) => setGoodsType(e.target.value)}
                      className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl p-2.5 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Sender Name</label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl p-2.5 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl p-2.5 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                      />
                    </div>
                  </div>

                  <div className="bg-[#fdf7ff] p-3 rounded-xl border border-[#e1d4fd] flex justify-between items-center text-xs">
                    <div>
                      <span className="text-gray-500 block">Rate: ₹{schedule.cargoRatePerKg} / kg</span>
                      <span className="font-bold text-gray-700">Calculated Freight Charge:</span>
                    </div>
                    <span className="text-lg font-black text-[#4f378a]">₹{totalCargoFare}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Fixed Footer */}
            <div className="p-4 border-t border-gray-100 bg-white flex gap-2 shrink-0">
              {step === 'success' ? (
                <>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/citizen/farmer/shipments');
                    }}
                    className="flex-1 py-2.5 bg-[#4f378a] hover:bg-[#382467] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    View My Shipments
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onClose}
                    disabled={step === 'processing'}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExecuteCargo}
                    disabled={step === 'processing' || schedule.availableCargoKg === 0}
                    className="flex-1 py-2.5 bg-[#4f378a] hover:bg-[#382467] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Confirm Cargo Bay
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          /* ===================================================================== */
          /* PASSENGER BOOKING FLOW (5 STATES IN 1 MODAL COMPONENT)                */
          /* ===================================================================== */
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header (Requirement Step 8) */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-[#fdf7ff] shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#4f378a] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">
                    {step === 'confirm' && 'confirmation_number'}
                    {step === 'payment' && 'payments'}
                    {step === 'processing' && 'sync'}
                    {step === 'success' && 'task_alt'}
                    {step === 'ticket' && 'receipt_long'}
                  </span>
                </span>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-[#1d1b20]">
                    {step === 'confirm' && 'Confirm Your Booking'}
                    {step === 'payment' && 'Complete Payment'}
                    {step === 'processing' && 'Processing Payment...'}
                    {step === 'success' && 'Payment Successful'}
                    {step === 'ticket' && 'Ticket Booked Successfully!'}
                  </h3>
                  <span className="text-[11px] text-gray-500 font-semibold">
                    {schedule.busNumber} • Route #{schedule.routeId}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (step !== 'processing') onClose();
                }}
                className="w-8 h-8 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors"
                title="Close"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Scrollable Body (Requirement Step 8) */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* ----------------------------------------------------------------- */}
              {/* STATE 1: CONFIRM YOUR BOOKING                                     */}
              {/* ----------------------------------------------------------------- */}
              {step === 'confirm' && (
                <div className="space-y-4">
                  {/* Route Box */}
                  <div className="bg-[#f8f2fa] p-4 rounded-2xl border border-[#e1d4fd] space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-[#4f378a] text-sm">{schedule.busNumber}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {schedule.status}
                      </span>
                    </div>

                    <div className="text-sm font-black text-[#1d1b20]">
                      {schedule.origin} <span className="text-[#4f378a]">→</span> {schedule.destination}
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-purple-100 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block uppercase">Departure</span>
                        <strong className="text-[#1d1b20]">{schedule.departureTime}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block uppercase">Arrival (Est)</span>
                        <strong className="text-[#1d1b20]">{schedule.arrivalTime}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 font-bold block uppercase">Date</span>
                        <strong className="text-[#1d1b20]">{schedule.date}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Passenger Stepper */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-700">Passenger Quantity:</span>
                      <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-gray-200 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                          disabled={passengerCount <= 1}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-black flex items-center justify-center disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-extrabold text-sm text-[#1d1b20]">
                          {passengerCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPassengerCount(Math.min(schedule.availableSeats, passengerCount + 1))}
                          disabled={passengerCount >= schedule.availableSeats}
                          className="w-7 h-7 rounded-lg bg-[#4f378a] hover:bg-[#382467] text-white font-black flex items-center justify-center disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500 pt-1 border-t border-gray-100">
                      <span>Available Seats: <strong>{schedule.availableSeats} / {schedule.passengerCapacity}</strong></span>
                      <span>Fare: <strong>₹{schedule.fare} per passenger</strong></span>
                    </div>

                    {schedule.availableSeats === 0 && (
                      <div className="p-2.5 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200 text-center">
                        No passenger seats are currently available.
                      </div>
                    )}
                  </div>

                  {/* Total Price Banner */}
                  <div className="flex justify-between items-center bg-[#fdf7ff] p-3.5 rounded-2xl border border-[#e1d4fd]">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Amount</span>
                      <span className="text-xs text-gray-600">₹{schedule.fare} × {passengerCount} Passenger(s)</span>
                    </div>
                    <span className="text-2xl font-black text-[#4f378a]">₹{totalFare}</span>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* STATE 2: COMPLETE PAYMENT                                         */}
              {/* ----------------------------------------------------------------- */}
              {step === 'payment' && (
                <div className="space-y-4">
                  {/* Summary Bar */}
                  <div className="bg-[#f8f2fa] p-3 rounded-2xl border border-[#e1d4fd] flex justify-between items-center text-xs">
                    <div>
                      <span className="text-gray-500 font-medium">{schedule.busNumber} • {passengerCount} Seat(s)</span>
                      <div className="font-bold text-[#1d1b20]">{schedule.origin} → {schedule.destination}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">Payable</span>
                      <span className="text-lg font-black text-[#4f378a]">₹{totalFare}</span>
                    </div>
                  </div>

                  {/* Payment Method Switcher */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">Select Payment Method:</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          paymentMethod === 'UPI'
                            ? 'bg-[#4f378a] text-white border-[#4f378a] shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                        UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Card')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          paymentMethod === 'Card'
                            ? 'bg-[#4f378a] text-white border-[#4f378a] shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">credit_card</span>
                        Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Net Banking')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          paymentMethod === 'Net Banking'
                            ? 'bg-[#4f378a] text-white border-[#4f378a] shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">account_balance</span>
                        Net Banking
                      </button>
                    </div>
                  </div>

                  {/* UPI Inputs */}
                  {paymentMethod === 'UPI' && (
                    <div className="space-y-2 text-xs bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                      <label className="font-bold text-gray-700 block">UPI ID / VPA</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="name@upi"
                        className="w-full bg-white text-xs text-[#1d1b20] rounded-xl p-2.5 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                      />
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['@okhdfcbank', '@okaxis', '@paytm', '@ybl'].map((suf) => (
                          <button
                            key={suf}
                            type="button"
                            onClick={() => setUpiId(`citizen${suf}`)}
                            className="px-2 py-0.5 bg-white rounded-md border border-gray-200 text-[10px] font-semibold text-gray-600 hover:border-[#4f378a]"
                          >
                            {suf}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Card Inputs */}
                  {paymentMethod === 'Card' && (
                    <div className="space-y-2 text-xs bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                      <div>
                        <label className="font-bold text-gray-700 block mb-0.5">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4532 •••• •••• ••••"
                          className="w-full bg-white text-xs text-[#1d1b20] rounded-xl p-2.5 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-gray-700 block mb-0.5">Expiry Date</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full bg-white text-xs text-[#1d1b20] rounded-xl p-2.5 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-0.5">CVV</label>
                          <input
                            type="password"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full bg-white text-xs text-[#1d1b20] rounded-xl p-2.5 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-0.5">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Name on card"
                          className="w-full bg-white text-xs text-[#1d1b20] rounded-xl p-2.5 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Net Banking Inputs */}
                  {paymentMethod === 'Net Banking' && (
                    <div className="space-y-2 text-xs bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                      <label className="font-bold text-gray-700 block">Select Your Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full bg-white text-xs text-[#1d1b20] rounded-xl p-2.5 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                      >
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Bank of Maharashtra">Bank of Maharashtra</option>
                        <option value="Bank of Baroda">Bank of Baroda</option>
                        <option value="Axis Bank">Axis Bank</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* STATE 3: PAYMENT PROCESSING                                       */}
              {/* ----------------------------------------------------------------- */}
              {step === 'processing' && (
                <div className="py-12 text-center space-y-3">
                  <div className="w-10 h-10 border-3 border-[#4f378a] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <h4 className="font-extrabold text-sm text-[#1d1b20]">Processing Payment...</h4>
                  <p className="text-gray-500 text-xs">Simulating bank gateway communication and issuing e-ticket confirmation.</p>
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* STATE 4: PAYMENT SUCCESSFUL                                       */}
              {/* ----------------------------------------------------------------- */}
              {step === 'success' && confirmedBooking && (
                <div className="space-y-4 text-center py-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-[#1d1b20]">Payment Successful</h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Your payment has been completed successfully.
                    </p>
                  </div>

                  <div className="bg-[#f8f2fa] p-3.5 rounded-2xl border border-[#e1d4fd] text-xs text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Booking ID:</span>
                      <strong className="text-[#1d1b20]">{confirmedBooking.bookingId}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount Paid:</span>
                      <strong className="text-emerald-700 font-black">₹{confirmedBooking.totalAmount}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Method:</span>
                      <strong className="text-[#1d1b20]">{confirmedBooking.paymentMethod}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Transaction ID:</span>
                      <strong className="text-[#1d1b20] font-mono text-[11px]">{confirmedBooking.transactionId}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date & Time:</span>
                      <strong className="text-[#1d1b20]">{confirmedBooking.bookedAt}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* STATE 5: TICKET BOOKED SUCCESSFULLY                               */}
              {/* ----------------------------------------------------------------- */}
              {step === 'ticket' && confirmedBooking && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-b from-[#22005d] to-[#382467] text-white p-5 rounded-2xl shadow-md space-y-3 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-purple-200 font-bold uppercase tracking-wider">KOPARGAON CONNECT E-TICKET</span>
                        <h4 className="text-lg font-black">{confirmedBooking.busNumber}</h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-400 text-emerald-950 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">check_circle</span>
                        CONFIRMED
                      </span>
                    </div>

                    <div className="text-xs font-bold text-purple-100 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                      {confirmedBooking.origin} → {confirmedBooking.destination}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/20">
                      <div>
                        <span className="text-[10px] text-purple-300 block">Booking ID</span>
                        <strong className="text-white text-xs">{confirmedBooking.bookingId}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-purple-300 block">Journey Date</span>
                        <strong className="text-white text-xs">{confirmedBooking.date}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-purple-300 block">Timing</span>
                        <strong className="text-white text-xs">{confirmedBooking.departureTime} – {confirmedBooking.arrivalTime}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-purple-300 block">Seats</span>
                        <strong className="text-white text-xs">{confirmedBooking.passengerCount} Passenger(s)</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-dashed border-white/30 flex justify-between items-center text-xs">
                      <span className="text-purple-200 font-bold">Total Amount Paid (PAID):</span>
                      <span className="text-lg font-black text-amber-300">₹{confirmedBooking.totalAmount}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fixed Footer with Visible Buttons (Requirement Step 8) */}
            <div className="p-4 border-t border-gray-100 bg-white flex gap-2 shrink-0">
              {step === 'confirm' && (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('payment')}
                    disabled={schedule.availableSeats === 0}
                    className="flex-1 py-2.5 bg-[#4f378a] hover:bg-[#382467] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <span>Proceed to Payment</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </>
              )}

              {step === 'payment' && (
                <>
                  <button
                    type="button"
                    onClick={() => setStep('confirm')}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleExecutePayment}
                    className="flex-1 py-2.5 bg-[#4f378a] hover:bg-[#382467] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    <span>Pay ₹{totalFare}</span>
                  </button>
                </>
              )}

              {step === 'success' && (
                <>
                  <button
                    type="button"
                    onClick={() => setStep('ticket')}
                    className="flex-1 py-2.5 bg-[#4f378a] hover:bg-[#382467] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">confirmation_number</span>
                    View Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('ticket')}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Continue
                  </button>
                </>
              )}

              {step === 'ticket' && (
                <>
                  <button
                    type="button"
                    onClick={handleDownloadTicket}
                    className="flex-1 py-2.5 bg-white border-2 border-[#4f378a] text-[#4f378a] hover:bg-[#fdf7ff] font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    Download Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/citizen/bookings');
                    }}
                    className="flex-1 py-2.5 bg-[#4f378a] hover:bg-[#382467] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">airplane_ticket</span>
                    Go to My Bookings
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
