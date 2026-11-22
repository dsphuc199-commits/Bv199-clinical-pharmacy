"use client";

import { useState } from "react";

export default function LoginLocation() {
  const [point, setPoint] = useState<{ latitude: string; longitude: string }>();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  function shareLocation() {
    if (point) {
      setPoint(undefined);
      setMessage("Đã bỏ vị trí thiết bị cho lần đăng nhập này.");
      return;
    }
    if (!navigator.geolocation) {
      setMessage("Trình duyệt không cung cấp vị trí. Bạn vẫn có thể đăng nhập.");
      return;
    }

    setPending(true);
    setMessage("Đang lấy vị trí. Bạn vẫn có thể đăng nhập ngay.");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPoint({ latitude: coords.latitude.toFixed(3), longitude: coords.longitude.toFixed(3) });
        setPending(false);
        setMessage("Đã lấy vị trí. Vị trí ước tính sẽ được lưu nếu đăng nhập thành công.");
      },
      () => {
        setPending(false);
        setMessage("Chưa lấy được vị trí. Bạn vẫn có thể đăng nhập.");
      },
      { timeout: 8_000 },
    );
  }

  return (
    <div className="bv199-login-location">
      {point && (
        <>
          <input type="hidden" name="loginLatitude" value={point.latitude} />
          <input type="hidden" name="loginLongitude" value={point.longitude} />
        </>
      )}
      <button type="button" onClick={shareLocation} disabled={pending}>
        {point ? "Bỏ vị trí đã chia sẻ" : "Chia sẻ vị trí thiết bị (tùy chọn)"}
      </button>
      <span role="status">{message}</span>
    </div>
  );
}
