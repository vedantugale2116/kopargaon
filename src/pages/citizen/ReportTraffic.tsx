import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { VerificationBadge } from '../../components/common/VerificationBadge';

export const ReportTraffic: React.FC = () => {
  const { user } = useAuth();
  const { trafficRegions, trafficReports, addTrafficReport } = useData();
  const navigate = useNavigate();

  const [selectedRegionId, setSelectedRegionId] = useState(trafficRegions[2]?.id || 'reg-apmc-market');
  const [locationDetail, setLocationDetail] = useState('');
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string>('https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80');
  const [submitted, setSubmitted] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const region = trafficRegions.find(r => r.id === selectedRegionId);
    if (!region) return;

    addTrafficReport({
      userName: user?.name || 'Concerned Citizen',
      roadName: region.name,
      regionKey: region.id,
      locationDescription: locationDetail || `${region.name} junction`,
      description: description || 'Vehicle bottleneck causing slowdown.',
      photoUrl: photoPreview
    });

    setSubmitted(true);
    setTimeout(() => {
      navigate('/citizen/map');
    }, 1800);
  };

  const samplePhotoPresets = [
    {
      title: 'APMC Market Congestion',
      url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80',
      desc: 'Tractors and freight pickups queuing outside wholesale auction yard.'
    },
    {
      title: 'Road Maintenance / Pothole',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
      desc: 'Temporary single-lane road barrier due to municipal pipeline work.'
    },
    {
      title: 'Heavy Highway Traffic',
      url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80',
      desc: 'Slow vehicular movement along highway bypass.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-[#1d1b20] tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4f378a]">photo_camera</span>
              Report Traffic Incident & Bottleneck
            </h1>
            <p className="text-xs text-[#494551] mt-0.5">
              Crowdsource live road congestion. Upload a photo to alert fellow citizens and municipal traffic dispatch.
            </p>
          </div>
        </div>

        {/* Success Banner */}
        {submitted && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 animate-in fade-in">
            <span className="material-symbols-outlined text-2xl text-emerald-600">check_circle</span>
            <div>
              <div className="font-bold text-sm">Traffic Report Submitted Successfully!</div>
              <div className="text-xs text-emerald-700">
                Road congestion severity has been updated on the Live Map. Redirecting to Live Map...
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[#cbc4d2]/40">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Road / Region Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4b4263]">
                  Affected Road Corridor *
                </label>
                <select
                  value={selectedRegionId}
                  onChange={(e) => setSelectedRegionId(e.target.value)}
                  className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] font-semibold rounded-xl py-2.5 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                >
                  {trafficRegions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} (Current: {r.currentTraffic} - {r.reportCount} reports)
                    </option>
                  ))}
                </select>
              </div>

              {/* Exact Location Landmark */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4b4263]">
                  Exact Landmark / Location *
                </label>
                <input
                  type="text"
                  required
                  value={locationDetail}
                  onChange={(e) => setLocationDetail(e.target.value)}
                  placeholder="e.g. Near APMC Main Gate 2 / Railway Overbridge"
                  className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl py-2.5 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4b4263]">
                  Incident Description & Cause *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the cause: tractor breakdown, heavy onion truck loading queue, waterlogging, or narrow lane bottleneck..."
                  className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl py-2 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                ></textarea>
              </div>

              {/* Photo Upload Area */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-[#4b4263]">
                  Upload Incident Photo *
                </label>

                <div className="flex items-center gap-4">
                  {/* Photo Preview Thumbnail */}
                  <div className="w-28 h-24 rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-[#cbc4d2] relative shrink-0 flex items-center justify-center">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Incident" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-gray-400">add_a_photo</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#e1d4fd] text-[#4f378a] hover:bg-[#cfbcff] text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-xs">
                      <span className="material-symbols-outlined text-[18px]">upload_file</span>
                      <span>Browse Photo from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-gray-500">
                      Supports JPG, PNG up to 10MB. Or select a realistic scenario sample below.
                    </p>
                  </div>
                </div>

                {/* Photo Presets for Quick Demonstration */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-gray-500 mb-1.5">
                    Or select demonstration photo preset:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {samplePhotoPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPhotoPreview(preset.url);
                          setDescription(preset.desc);
                        }}
                        className={`p-2 rounded-xl text-left border text-[10px] transition-all flex flex-col gap-1 ${
                          photoPreview === preset.url
                            ? 'border-[#4f378a] bg-[#4f378a]/5 font-bold text-[#4f378a]'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <span className="truncate font-semibold">{preset.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitted}
                className="w-full bg-[#4f378a] hover:bg-[#382467] text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                SUBMIT TRAFFIC REPORT (UPDATE LIVE SEVERITY)
              </button>
            </form>
          </div>

          {/* Right Sidebar: Dynamic Severity Rules & Recent Reports */}
          <div className="space-y-4">
            {/* Rule Explainer Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#cbc4d2]/40 shadow-xs">
              <h3 className="font-bold text-xs text-[#1d1b20] uppercase tracking-wider mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[#4f378a] text-[18px]">rule</span>
                Traffic Severity Thresholds
              </h3>
              <p className="text-xs text-[#494551] mb-3 leading-relaxed">
                Kopargaon Connect automatically calculates dynamic road color based strictly on citizen photo report count for each road:
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="flex items-center gap-2 font-bold text-emerald-900">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                    0–1 Reports
                  </span>
                  <span className="font-extrabold text-emerald-800">GREEN (Clear)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-50 border border-yellow-200">
                  <span className="flex items-center gap-2 font-bold text-yellow-900">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]"></span>
                    2–3 Reports
                  </span>
                  <span className="font-extrabold text-yellow-800">YELLOW (Moderate)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50 border border-orange-200">
                  <span className="flex items-center gap-2 font-bold text-orange-900">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></span>
                    4 Reports
                  </span>
                  <span className="font-extrabold text-orange-800">ORANGE (Heavy)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 border border-red-200">
                  <span className="flex items-center gap-2 font-bold text-red-900">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
                    5+ Reports
                  </span>
                  <span className="font-extrabold text-red-800">RED (Severe)</span>
                </div>
              </div>
            </div>

            {/* Recent Citizen Reports with Photo Thumbnails */}
            <div className="bg-white rounded-2xl p-5 border border-[#cbc4d2]/40 shadow-xs">
              <h3 className="font-bold text-xs text-[#1d1b20] uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Recent Community Reports</span>
                <span className="text-[10px] text-gray-400 font-normal">Live Feed</span>
              </h3>
              <div className="space-y-3">
                {trafficReports.slice(0, 4).map((rep) => (
                  <div key={rep.id} className="p-3 bg-[#fdf7ff] rounded-xl border border-gray-200 flex gap-3 items-start">
                    <img src={rep.photoUrl} alt="Report" className="w-12 h-12 object-cover rounded-lg shrink-0 border border-gray-200" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#1d1b20] truncate">{rep.roadName}</span>
                        <span className="text-[10px] text-gray-400">{rep.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 truncate mt-0.5">{rep.description}</p>
                      <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                        <VerificationBadge
                          status={rep.verificationStatus || 'UNDER_REVIEW'}
                          duplicateCount={rep.duplicateCount}
                          size="xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
