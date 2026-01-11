const axios = require("axios");

exports.fetchAndInterpolate = async (lat, lon) => {
  // 1. Dùng hourly data cho forecast 7 ngày
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,wind_direction_10m,pressure_msl&forecast_days=7&timezone=auto`;

  const response = await axios.get(url);
  const raw = response.data.hourly;

  // Hàm chuyển đổi hướng gió
  const getWindDirection = (degree) => {
    const directions = [
      "Bắc",
      "Đông Bắc",
      "Đông",
      "Đông Nam",
      "Nam",
      "Tây Nam",
      "Tây",
      "Tây Bắc",
    ];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
  };

  const now = new Date();
  let startIndex = 0;

  // Tìm mốc thời gian bắt đầu (gần nhất với hiện tại)
  for (let i = 0; i < raw.time.length; i++) {
    const apiTime = new Date(raw.time[i]);
    if (apiTime >= now) {
      startIndex = i;
      break;
    }
  }

  let data = [];

  // 2. Lặp qua dữ liệu hourly (mỗi giờ một điểm)
  // Không nội suy nữa vì khoảng cách giữa các điểm dữ liệu đã là 1 giờ
  for (let i = startIndex; i < raw.time.length; i++) {
    const time = new Date(raw.time[i]);

    // Format thời gian: DD-MM-YYYY HH:MM:SS
    const dateTimeStr = `${time.getDate().toString().padStart(2, "0")}-${(
      time.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${time.getFullYear()} ${time
      .getHours()
      .toString()
      .padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    data.push({
      ThoiGian: dateTimeStr,
      NhietDo: Number(raw.temperature_2m[i]?.toFixed(1) ?? 0),
      DoAm: Math.round(raw.relative_humidity_2m[i] ?? 0),
      CamGiacNhu: Number(raw.apparent_temperature[i]?.toFixed(1) ?? 0),
      LuongMua: Number(raw.precipitation[i]?.toFixed(1) ?? 0),
      TocDoGio: Number(raw.wind_speed_10m[i]?.toFixed(1) ?? 0),
      HuongGio: getWindDirection(raw.wind_direction_10m[i] ?? 0),
      ApSuat: Number(((raw.pressure_msl[i] ?? 0) / 33.864).toFixed(3)),
    });
  }

  return data;
};
