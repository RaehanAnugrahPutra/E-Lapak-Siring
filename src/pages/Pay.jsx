import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Pay() {
  const [params] = useSearchParams();
  const tx = params.get("tx");

  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    localStorage.setItem("paid_" + tx, "success");
    setPaid(true);
  };

  useEffect(() => {
    const check = localStorage.getItem("paid_" + tx);
    if (check === "success") setPaid(true);
  }, []);

  if (!tx) return <h3>Tidak ada transaksi.</h3>;

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Pembayaran Stand</h2>
      <p>ID Transaksi: <b>{tx}</b></p>

      {paid ? (
        <h3 style={{ color: "green" }}>Pembayaran Berhasil ✔</h3>
      ) : (
        <button
          style={{
            padding: 12,
            background: "#0ea5e9",
            borderRadius: 8,
            border: "none",
            fontSize: 18,
            color: "white"
          }}
          onClick={handlePay}
        >
          Bayar Sekarang
        </button>
      )}
    </div>
  );
}
