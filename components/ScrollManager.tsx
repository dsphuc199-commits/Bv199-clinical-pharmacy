
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/*
  BV199 SCROLL MANAGER

  Đặt lại vị trí cuộn khi thay đổi đường dẫn.
  Không can thiệp vùng cuộn Sidebar.
*/

export default function ScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    const resetMainScroll = () => {
      const main = document.getElementById(
        "bv199-main-scroll"
      );

      if (main) {
        main.scrollTop = 0;
        main.scrollLeft = 0;
      }

      window.scrollTo(0, 0);
    };

    resetMainScroll();

    const frame = requestAnimationFrame(
      resetMainScroll
    );

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
