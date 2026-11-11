"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/* O mat khau co nut hien/an; tat tu viet hoa, tu sua chu tren ban phim dien thoai. */
export default function PasswordField() {
  const [show, setShow] = useState(false);
  return (
    <div className="bv199-pw">
      <input
        id="login-password"
        name="password"
        type={show ? "text" : "password"}
        autoComplete="current-password"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        required
      />
      <button type="button" className="bv199-pw-toggle" onClick={() => setShow((s) => !s)} aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"} aria-pressed={show}>
        {show ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
      </button>
    </div>
  );
}
