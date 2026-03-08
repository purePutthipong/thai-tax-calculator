"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function Home() {
  const [income, setIncome] = useState("");
  const [incomeType, setIncomeType] = useState("salary");
  const [status, setStatus] = useState("single");
  const [insurance, setInsurance] = useState("");
  const [ssf, setSsf] = useState("");
  const [rmf, setRmf] = useState("");
  const [shopDeduct, setShopDeduct] = useState("");
  const [result, setResult] = useState<{
    incomeNum: number;
    expense: number;
    personalDeduct: number;
    spouseDeduct: number;
    extraDeduct: number;
    netIncome: number;
    tax: number;
    suggestions: { name: string; max: number; saved: number; desc: string }[];
  } | null>(null);

  const calculate = () => {
    const incomeNum = parseFloat(income) || 0;
    let expense = 0;
    if (incomeType === "salary") expense = Math.min(incomeNum * 0.5, 100000);
    if (incomeType === "freelance") expense = Math.min(incomeNum * 0.5, 100000);
    if (incomeType === "business") expense = Math.min(incomeNum * 0.6, 100000);

    const personalDeduct = 60000;
    const spouseDeduct = status === "married" ? 60000 : 0;
    const insuranceNum = Math.min(parseFloat(insurance) || 0, 100000);
    const ssfNum = Math.min(
      parseFloat(ssf) || 0,
      Math.min(incomeNum * 0.3, 200000),
    );
    const rmfNum = Math.min(
      parseFloat(rmf) || 0,
      Math.min(incomeNum * 0.3, 500000),
    );
    const shopNum = Math.min(parseFloat(shopDeduct) || 0, 50000);
    const extraDeduct = insuranceNum + ssfNum + rmfNum + shopNum;
    const netIncome = Math.max(
      0,
      incomeNum - expense - personalDeduct - spouseDeduct - extraDeduct,
    );

    let tax = 0;
    if (netIncome <= 150000) tax = 0;
    else if (netIncome <= 300000) tax = (netIncome - 150000) * 0.05;
    else if (netIncome <= 500000) tax = 7500 + (netIncome - 300000) * 0.1;
    else if (netIncome <= 750000) tax = 27500 + (netIncome - 500000) * 0.15;
    else if (netIncome <= 1000000) tax = 65000 + (netIncome - 750000) * 0.2;
    else if (netIncome <= 2000000) tax = 115000 + (netIncome - 1000000) * 0.25;
    else if (netIncome <= 5000000) tax = 365000 + (netIncome - 2000000) * 0.3;
    else tax = 1265000 + (netIncome - 5000000) * 0.35;

    const suggestions = [
      {
        name: "ประกันชีวิต",
        max: 100000,
        saved: Math.min(100000 - insuranceNum, netIncome) * 0.05,
        desc: "ลดหย่อนได้สูงสุด 100,000 บาท",
      },
      {
        name: "SSF",
        max: Math.min(incomeNum * 0.3, 200000),
        saved: Math.min(incomeNum * 0.3 - ssfNum, 200000) * 0.05,
        desc: "ลดหย่อนได้ 30% ของรายได้ สูงสุด 200,000 บาท",
      },
      {
        name: "RMF",
        max: Math.min(incomeNum * 0.3, 500000),
        saved: Math.min(incomeNum * 0.3 - rmfNum, 500000) * 0.05,
        desc: "ลดหย่อนได้ 30% ของรายได้ สูงสุด 500,000 บาท",
      },
      {
        name: "ช้อปดีมีคืน",
        max: 50000,
        saved: Math.min(50000 - shopNum, netIncome) * 0.05,
        desc: "ลดหย่อนได้สูงสุด 50,000 บาท",
      },
    ].filter((s) => s.saved > 0);

    setResult({
      incomeNum,
      expense,
      personalDeduct,
      spouseDeduct,
      extraDeduct,
      netIncome,
      tax,
      suggestions,
    });
  };

  const fmt = (n: number) =>
    n.toLocaleString("th-TH", { minimumFractionDigits: 2 });

  const bracketData = result
    ? [
        { name: "0-150K", tax: 0, rate: "0%" },
        {
          name: "150-300K",
          tax: Math.min(Math.max(result.netIncome - 150000, 0), 150000) * 0.05,
          rate: "5%",
        },
        {
          name: "300-500K",
          tax: Math.min(Math.max(result.netIncome - 300000, 0), 200000) * 0.1,
          rate: "10%",
        },
        {
          name: "500-750K",
          tax: Math.min(Math.max(result.netIncome - 500000, 0), 250000) * 0.15,
          rate: "15%",
        },
        {
          name: "750K-1M",
          tax: Math.min(Math.max(result.netIncome - 750000, 0), 250000) * 0.2,
          rate: "20%",
        },
        {
          name: "1-2M",
          tax:
            Math.min(Math.max(result.netIncome - 1000000, 0), 1000000) * 0.25,
          rate: "25%",
        },
      ].filter((d) => d.tax > 0)
    : [];

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white transition";

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-4">
        {/* Header */}
        <div className="text-center py-4">
          <h1 className="text-3xl font-bold text-gray-800">🧾 คำนวณภาษี</h1>
          <p className="text-gray-500 text-sm mt-1">
            เงินได้บุคคลธรรมดา ปีภาษี 2567
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
            ⚠️ ตัวเลขนี้เป็นการ <strong>ประมาณการเท่านั้น</strong>{" "}
            ควรปรึกษานักบัญชีก่อนยื่นจริง
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              รายได้ต่อปี (บาท)
            </label>
            <input
              type="number"
              placeholder="เช่น 600,000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ประเภทรายได้
              </label>
              <select
                value={incomeType}
                onChange={(e) => setIncomeType(e.target.value)}
                className={inputClass}
                style={{ fontSize: "16px" }}
              >
                <option value="salary">เงินเดือน (40(1))</option>
                <option value="freelance">ฟรีแลนซ์ (40(2))</option>
                <option value="business">ธุรกิจ (40(8))</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                สถานภาพ
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputClass}
                style={{ fontSize: "16px" }}
              >
                <option value="single">โสด</option>
                <option value="married">สมรส</option>
              </select>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              ✅ ลดหย่อนที่ใช้ไปแล้ว
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  ประกันชีวิต (≤100K)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={insurance}
                  onChange={(e) => setInsurance(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  SSF (≤200K)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={ssf}
                  onChange={(e) => setSsf(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  RMF (≤500K)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={rmf}
                  onChange={(e) => setRmf(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  ช้อปดีมีคืน (≤50K)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={shopDeduct}
                  onChange={(e) => setShopDeduct(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <button
            onClick={calculate}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-4 rounded-2xl transition-all text-base"
          >
            คำนวณภาษี →
          </button>
        </div>

        {/* Result Card */}
        {result && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
            {/* Tax Summary */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-5 text-center">
              <p className="text-sm text-gray-500 mb-1">ภาษีที่ต้องจ่าย</p>
              <p className="text-4xl font-bold text-red-500">
                {fmt(result.tax)}
              </p>
              <p className="text-sm text-gray-400 mt-1">บาท</p>
            </div>

            {/* Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>รายได้รวม</span>
                <span>{fmt(result.incomeNum)} บาท</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>หักค่าใช้จ่าย</span>
                <span className="text-red-400">
                  - {fmt(result.expense)} บาท
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>หักค่าลดหย่อนส่วนตัว</span>
                <span className="text-red-400">
                  - {fmt(result.personalDeduct)} บาท
                </span>
              </div>
              {result.spouseDeduct > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>หักลดหย่อนคู่สมรส</span>
                  <span className="text-red-400">
                    - {fmt(result.spouseDeduct)} บาท
                  </span>
                </div>
              )}
              {result.extraDeduct > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>หักลดหย่อนเพิ่มเติม</span>
                  <span className="text-red-400">
                    - {fmt(result.extraDeduct)} บาท
                  </span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-gray-700 border-t pt-2">
                <span>เงินได้สุทธิ</span>
                <span>{fmt(result.netIncome)} บาท</span>
              </div>
            </div>

            {/* Chart */}
            {bracketData.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  📊 ภาษีแต่ละ Bracket
                </p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={bracketData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                    />
                    <Tooltip
                      formatter={(v: unknown) =>
                        `${Number(v).toLocaleString("th-TH", { maximumFractionDigits: 0 })} บาท`
                      }
                    />
                    <Bar dataKey="tax" radius={[6, 6, 0, 0]}>
                      {bracketData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={`hsl(${220 + i * 15}, 70%, ${65 - i * 5}%)`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-green-600 mb-3">
                  💡 ลดหย่อนเพิ่มได้อีก!
                </p>
                <div className="space-y-2">
                  {result.suggestions.map((s) => (
                    <div
                      key={s.name}
                      className="flex justify-between items-center bg-green-50 rounded-xl px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {s.name}
                        </p>
                        <p className="text-xs text-gray-400">{s.desc}</p>
                      </div>
                      <span className="text-sm font-bold text-green-600 whitespace-nowrap ml-2">
                        ~
                        {s.saved.toLocaleString("th-TH", {
                          maximumFractionDigits: 0,
                        })}{" "}
                        บาท
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
