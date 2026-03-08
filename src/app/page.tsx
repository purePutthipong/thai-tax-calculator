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
    const spouseDeduct = status === "married" ? 60000 : 0;
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
        saved: Math.min(100000, netIncome) * 0.05,
        desc: "ลดหย่อนได้สูงสุด 100,000 บาท",
      },
      {
        name: "SSF (กองทุนรวม)",
        max: Math.min(incomeNum * 0.3, 200000),
        saved: Math.min(incomeNum * 0.3, 200000) * 0.05,
        desc: "ลดหย่อนได้ 30% ของรายได้ สูงสุด 200,000 บาท",
      },
      {
        name: "RMF (กองทุนเกษียณ)",
        max: Math.min(incomeNum * 0.3, 500000),
        saved: Math.min(incomeNum * 0.3, 500000) * 0.05,
        desc: "ลดหย่อนได้ 30% ของรายได้ สูงสุด 500,000 บาท",
      },
      {
        name: "ช้อปดีมีคืน",
        max: 50000,
        saved: Math.min(50000, netIncome) * 0.05,
        desc: "ลดหย่อนได้สูงสุด 50,000 บาท",
      },
    ];

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

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          🧾 คำนวณภาษีเงินได้บุคคลธรรมดา
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          กรอกข้อมูลเพื่อดูภาษีที่ต้องจ่าย และวิธีประหยัดภาษี
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-4 text-xs text-yellow-700">
          ⚠️ ตัวเลขนี้เป็นการ <strong>ประมาณการเท่านั้น</strong>{" "}
          ไม่ใช่คำแนะนำทางกฎหมายหรือภาษี
          ควรปรึกษานักบัญชีหรือสรรพากรก่อนยื่นภาษีจริง
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รายได้ต่อปี (บาท)
            </label>
            <input
              type="number"
              placeholder="เช่น 600000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ประเภทรายได้
            </label>
            <select
              value={incomeType}
              onChange={(e) => setIncomeType(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="salary">เงินเดือน (40(1))</option>
              <option value="freelance">ฟรีแลนซ์ (40(2))</option>
              <option value="business">ธุรกิจ (40(8))</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              สถานภาพ
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="single">โสด</option>
              <option value="married">สมรส</option>
            </select>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">
              ✅ ลดหย่อนที่ใช้ไปแล้ว (ถ้ามี)
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  ประกันชีวิต (สูงสุด 100,000)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={insurance}
                  onChange={(e) => setInsurance(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  SSF (สูงสุด 30% ของรายได้ / 200,000)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={ssf}
                  onChange={(e) => setSsf(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  RMF (สูงสุด 30% ของรายได้ / 500,000)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={rmf}
                  onChange={(e) => setRmf(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  ช้อปดีมีคืน (สูงสุด 50,000)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={shopDeduct}
                  onChange={(e) => setShopDeduct(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                />
              </div>
            </div>
          </div>

          <button
            onClick={calculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            คำนวณภาษี →
          </button>
        </div>

        {result && (
          <div className="mt-6 bg-gray-50 rounded-xl p-5 space-y-2 text-sm">
            <h2 className="font-bold text-gray-700 text-base mb-3">
              📊 สรุปผลการคำนวณ
            </h2>
            <div className="flex justify-between text-gray-600">
              <span>รายได้รวม</span>
              <span>{fmt(result.incomeNum)} บาท</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>หักค่าใช้จ่าย</span>
              <span>- {fmt(result.expense)} บาท</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>หักค่าลดหย่อนส่วนตัว</span>
              <span>- {fmt(result.personalDeduct)} บาท</span>
            </div>
            {result.spouseDeduct > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>หักค่าลดหย่อนคู่สมรส</span>
                <span>- {fmt(result.spouseDeduct)} บาท</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600 border-t pt-2">
              <span>เงินได้สุทธิ</span>
              <span>{fmt(result.netIncome)} บาท</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-red-500 border-t pt-2">
              <span>ภาษีที่ต้องจ่าย</span>
              <span>{fmt(result.tax)} บาท</span>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="font-bold text-gray-700 mb-3">
                📊 ภาษีแต่ละ Bracket
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={bracketData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(v: unknown) =>
                      `${Number(v).toLocaleString("th-TH", { maximumFractionDigits: 0 })} บาท`
                    }
                  />
                  <Bar dataKey="tax" radius={[4, 4, 0, 0]}>
                    {bracketData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={`hsl(${200 + i * 20}, 70%, ${60 - i * 5}%)`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="font-bold text-green-600 mb-3">
                💡 ลดหย่อนเพิ่มได้อีก!
              </p>
              <div className="space-y-2">
                {result.suggestions.map((s) => (
                  <div key={s.name} className="bg-green-50 rounded-lg p-3">
                    <div className="flex justify-between font-medium text-gray-700">
                      <span>{s.name}</span>
                      <span className="text-green-600">
                        ประหยัดได้ ~
                        {s.saved.toLocaleString("th-TH", {
                          maximumFractionDigits: 0,
                        })}{" "}
                        บาท
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
