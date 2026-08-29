import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { PassengerBooking } from '../../lib/mockData';

export const MyBookings: React.FC = () => {
  const { passengerBookings } = useData();
  const navigate = useNavigate();

  const handleDownloadSingleTicket = (booking: PassengerBooking) => {
    const ticketContent = `
============================================================
              KOPARGAON CONNECT SMART MOBILITY
                 OFFICIAL MSRTC E-TICKET
============================================================
Booking ID      : ${booking.bookingId}
Transaction ID  : ${booking.transactionId}
Date & Time     : ${booking.bookedAt}
Status          : ${booking.bookingStatus} (PAID)
------------------------------------------------------------
Bus Number      : ${booking.busNumber}
Route           : ${booking.origin} → ${booking.destination}
Journey Date    : ${booking.date}
Departure Time  : ${booking.departureTime}
Arrival Time    : ${booking.arrivalTime}
Passengers      : ${booking.passengerCount} Seat(s)
------------------------------------------------------------
Fare Per Seat   : ₹${booking.farePerPassenger}
Total Paid      : ₹${booking.totalAmount}
Payment Method  : ${booking.paymentMethod}
Passenger Name  : ${booking.userName}
============================================================
Valid for travel on Kopargaon Smart Rural Transit Network.
Please show this ticket along with a valid ID during transit.
============================================================
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KopargaonConnect_Ticket_${booking.bookingId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1d1b20] tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4f378a]">confirmation_number</span>
              My Bus Bookings & E-Tickets
            </h1>
            <p className="text-xs text-[#494551] mt-0.5">
              Access your confirmed MSRTC bus tickets, payment receipts, and travel passes in Kopargaon.
            </p>
          </div>

          <button
            onClick={() => navigate('/citizen/bus-schedules')}
            className="bg-[#4f378a] hover:bg-[#382467] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Book New Ticket
          </button>
        </div>

        {/* Bookings List */}
        {passengerBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-[#cbc4d2]/40 text-center space-y-3 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-purple-50 text-[#4f378a] mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">airplane_ticket</span>
            </div>
            <h3 className="font-extrabold text-base text-[#1d1b20]">No Active Bookings Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              You haven't booked any bus tickets yet. Browse available rural routes and reserve your seats with live payment simulation.
            </p>
            <button
              onClick={() => navigate('/citizen/bus-schedules')}
              className="mt-2 px-5 py-2.5 bg-[#4f378a] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#382467]"
            >
              Browse Bus Schedules
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {passengerBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl p-5 border border-[#cbc4d2]/40 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-5"
              >
                {/* Left Ticket Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black bg-[#f8f2fa] text-[#4f378a] px-3 py-1 rounded-lg border border-[#e1d4fd]">
                      {booking.bookingId}
                    </span>
                    <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-md">
                      {booking.busNumber}
                    </span>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span>
                      {booking.bookingStatus} (PAID)
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-[#1d1b20]">
                      {booking.origin} <span className="text-[#4f378a]">→</span> {booking.destination}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Booked on: {booking.bookedAt} • Passenger: {booking.userName}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">Date</span>
                      <strong className="text-[#1d1b20]">{booking.date}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">Departure</span>
                      <strong className="text-[#1d1b20]">{booking.departureTime}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">Seats</span>
                      <strong className="text-[#1d1b20]">{booking.passengerCount} Person(s)</strong>
                    </div>
                  </div>
                </div>

                {/* Right Action & Fare Panel */}
                <div className="md:w-56 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-5 space-y-3">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Paid via {booking.paymentMethod}</span>
                    <span className="text-xl font-black text-[#4f378a]">₹{booking.totalAmount}</span>
                    <span className="text-[10px] text-gray-400 block font-mono">TXN: {booking.transactionId}</span>
                  </div>

                  <button
                    onClick={() => handleDownloadSingleTicket(booking)}
                    className="w-full py-2.5 bg-[#f8f2fa] hover:bg-[#e1d4fd]/50 border border-[#e1d4fd] text-[#4f378a] font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    Download Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
