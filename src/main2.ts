import '../src/style.scss'
const g = 9.81; 
const h = 3.05; 

const calculateShotAngleAndSpeed = (d: number, height: number) => {
    const h0 = height + 0.2; // Учитываем рост человека + высоту мяча
    const toRadians = (deg: number) => (deg * Math.PI) / 180;

    let bestAngle = 0;
    let bestSpeed = Infinity;

    for (let angle = 10; angle <= 80; angle += 0.1) {
        const rad = toRadians(angle);
        const cos2 = Math.cos(rad) ** 2;
        const tan = Math.tan(rad);

        const hDiff = h - h0 - d * tan;

        console.log(`Угол: ${angle}° | hDiff: ${hDiff}`);

        if (hDiff <= 0) {
            continue; 
        }

        const denominator = 2 * cos2 * hDiff;

        if (denominator <= 0) continue; 

        const v0 = Math.sqrt((g * d ** 2) / denominator);


        if (!isNaN(v0) && isFinite(v0) && v0 > 0 && v0 < bestSpeed) {
            bestSpeed = v0;
            bestAngle = angle;
        }
    }

    if (bestSpeed === Infinity) {
        return { angle: NaN, speed: NaN };
    }

    return { angle: bestAngle, speed: bestSpeed };
};

document.getElementById("calculate")?.addEventListener("click", () => {
    const distance = parseFloat((document.getElementById("distance") as HTMLInputElement).value);
    const height = parseFloat((document.getElementById("height") as HTMLInputElement).value);

    if (distance <= 0) return alert("Введите корректное расстояние!");

    const result = calculateShotAngleAndSpeed(distance, height);

    if (isNaN(result.angle) || isNaN(result.speed)) {
        document.getElementById("result")!.textContent =
            "Не удалось найти подходящий угол. Попробуйте другое расстояние.";
    } else {
        document.getElementById("result")!.textContent =
            `Оптимальный угол: ${result.angle.toFixed(2)}°, Скорость: ${result.speed.toFixed(2)} м/с`;
    }
});