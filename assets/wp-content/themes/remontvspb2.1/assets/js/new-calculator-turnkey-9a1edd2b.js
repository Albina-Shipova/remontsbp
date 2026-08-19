
document.addEventListener("DOMContentLoaded", function () {
    // === Переменные DOM ===
    const modal = document.getElementById("calcModal");
    const openModalBtn = document.getElementById("open-popup");
    const closeModalBtn = document.querySelector(".close");
    const breakdownDiv = document.getElementById("breakdown");
    const nameInput = document.getElementById("nameInput");
    //   const phoneInput         = document.getElementById("phoneInput");
    const agreementCheckbox = document.getElementById("agreementCheckbox");
    const continueBtn = document.querySelector(".leave-request-btn");
    const areaInput = document.getElementById("area");
    const incrementButton = document.getElementById("increment");
    const decrementButton = document.getElementById("decrement");

    // === Данные для расчёта ===
    const unitPrices = {
        floor: { 1: 550, 2: 495, 3: 455, 4: 455, 5: 455, studio: 560 },
        wall: { 1: 500, 2: 297, 3: 213, 4: 213, 5: 213, studio: 518 },
        doors: { 1: 5000, 2: 5000, 3: 5000, 4: 5000, 5: 5000, studio: 5000 },
        ceiling: { 1: 1800, 2: 1500, 3: 1300, 4: 1370, 5: 1470, studio: 2000 },
        electrics: { 1: 130, 2: 110, 3: 90, 4: 90, 5: 90, studio: 130 },
        plumbing: { 1: 1150, 2: 800, 3: 600, 4: 900, 5: 1000, studio: 1150 },
        furniture: { 1: 1050, 2: 770, 3: 620, 4: 620, 5: 620, studio: 1050 },
        kitchen: { 1: 20000, 2: 30000, 3: 40000, 4: 28500, 5: 28000, studio: 31000 }
    };
    const roomMultipliers = { 1: 0.05, 2: 0.10, 3: 0.15, 4: 0.20, 5: 0.25, studio: 0 };

    // === Утилиты ===
    function getSelectedValue(selector) {
        const el = document.querySelector(selector + ".active");
        return el ? el.textContent.trim().toLowerCase() : "";
    }


    // === Логика расчёта ===
    function updateMaterialCircles() {
        const hasFinish = document.querySelector(".finish-material-toggle.active");
        document.querySelectorAll(".radio-btn").forEach(b => {
            b.style.pointerEvents = hasFinish ? "auto" : "none";
            if (!hasFinish) b.classList.remove("active");
        });
        if (hasFinish) {
            document.querySelectorAll(".radio-group").forEach(g => {
                const first = g.querySelector(".radio-btn");
                if (first) first.classList.add("active");
            });
        }
    }

    function calculateBudgetRepairCost() {
        const area = parseFloat(areaInput?.value) || 0;
        const selRoom = document.querySelector(".room-btn.active, .studio-btn.active");
        if (!selRoom || area <= 0) {
            let totalCostRange = document.getElementById("total-cost-range");
            totalCostRange && (totalCostRange.textContent = "0");
            breakdownDiv && (breakdownDiv.innerHTML = "");
            return;
        }
        // ключ комнаты
        let rv = selRoom.textContent.trim().toLowerCase();
        const roomKey = rv === "студия" ? "studio" : parseInt(rv);
        const roomMult = roomMultipliers[roomKey];

        // 1) работы
        let costLabor = 10000 * area;
        const repairType = getSelectedValue(".options-rem .btn");
        const repMult = repairType === "косметический" ? 1.1 : repairType === "капитальный" ? 1.2 : repairType === "дизайнерский" ? 1.3 : 1;
        const propType = getSelectedValue(".housing-type-group .btn");
        const propMult = propType === "вторичное" ? 1.2 : 1;
        costLabor = costLabor * repMult * propMult;
        document.querySelectorAll(".toggle-wrapper").forEach(w => {
            const labelEl = w.querySelector("span");
            if (!labelEl) return; // ❗ Если нет span — пропускаем этот блок
            const lbl = w.querySelector("span").textContent.trim().toLowerCase();
            if (w.querySelector(".toggle").classList.contains("active")) {
                if (lbl === "демонтаж") costLabor *= 1.03;
                if (lbl === "перепланировка") costLabor *= 1.06;
            }
        });
        if (rv !== "студия") costLabor *= (1 + roomMult);

        document.getElementById('cost-labor').textContent = `${Math.round(costLabor * 0.97).toLocaleString("ru-RU")} - ${Math.round(costLabor * 1.13).toLocaleString("ru-RU")}`;

        let baseCost = costLabor;

        // 2) чистовые материалы
        let costFloor = 0, costWall = 0, costDoors = 0, costCeiling = 0,
            costElectrics = 0, costPlumbing = 0, costFurniture = 0, costKitchen = 0;
        document.getElementById('div-material-clear').style.display = 'none';
        document.getElementById('floor-material').textContent = `0`;
        document.getElementById('walls-material').textContent = `0`;
        document.getElementById('doors-material').textContent = `0`;
        document.getElementById('ceiling-material').textContent = `0`;
        document.getElementById('electrics-material').textContent = `0`;
        document.getElementById('plumbing-material').textContent = `0`;
        document.getElementById('furniture-material').textContent = `0`;
        document.getElementById('kitchen-material').textContent = `0`;
        document.getElementById('clear-matrial').textContent = `0`;

        if (document.querySelector(".finish-material-toggle.active")) {
            function getMult(label, arr) {
                let m = arr[0];
                document.querySelectorAll(".material-row").forEach(r => {
                    if (r.textContent.includes(label)) {
                        r.querySelectorAll(".radio-btn").forEach((b, i) => {
                            if (b.classList.contains("active")) m = arr[i];
                        });
                    }
                });
                return m;
            }
            document.getElementById('div-material-clear').style.display = 'block';
            const mf = getMult("Напольные покрытия", [0, 1, 3, 10]);
            const mw = getMult("Настенные покрытия", [0, 1, 7, 10]);
            const md = getMult("Двери", [0, 1, 5, 9]);
            const mc = getMult("Потолок", [0, 1, 1, 1.7]);
            const me = getMult("Электрика", [0, 1, 7.5, 9.5]);
            const ms = getMult("Сантехника", [0, 1, 6, 10.5]);
            const mfurn = getMult("Мебель", [0, 1, 7, 16]);
            const mk = getMult("Кухня", [0, 1, 11, 23]);

            costFloor = (unitPrices.floor[roomKey] * (1 + roomMult)) * area * mf;
            document.getElementById('floor-material').textContent = `${Math.round(costFloor * 0.97).toLocaleString("ru-RU")} - ${Math.round(costFloor * 1.13).toLocaleString("ru-RU")}`;

            costWall = (unitPrices.wall[roomKey] * (1 + roomMult)) * area * mw;
            document.getElementById('walls-material').textContent = `${Math.round(costWall * 0.97).toLocaleString("ru-RU")} - ${Math.round(costWall * 1.13).toLocaleString("ru-RU")}`;

            costDoors = (unitPrices.doors[roomKey] + 11530) * md;
            document.getElementById('doors-material').textContent = `${Math.round(costDoors * 0.97).toLocaleString("ru-RU")} - ${Math.round(costDoors * 1.13).toLocaleString("ru-RU")}`;

            costCeiling = (unitPrices.ceiling[roomKey] * (1 + roomMult)) * area * mc;
            document.getElementById('ceiling-material').textContent = `${Math.round(costCeiling * 0.97).toLocaleString("ru-RU")} - ${Math.round(costCeiling * 1.13).toLocaleString("ru-RU")}`;

            costElectrics = 180 * me * area;
            document.getElementById('electrics-material').textContent = `${Math.round(costElectrics * 0.97).toLocaleString("ru-RU")} - ${Math.round(costElectrics * 1.13).toLocaleString("ru-RU")}`;

            costPlumbing = (unitPrices.plumbing[roomKey] * (1 + roomMult)) * area * ms;
            document.getElementById('plumbing-material').textContent = `${Math.round(costPlumbing * 0.97).toLocaleString("ru-RU")} - ${Math.round(costPlumbing * 1.13).toLocaleString("ru-RU")}`;

            costFurniture = (unitPrices.furniture[roomKey] * (1 + roomMult)) * area * mfurn;
            document.getElementById('furniture-material').textContent = `${Math.round(costFurniture * 0.97).toLocaleString("ru-RU")} - ${Math.round(costFurniture * 1.13).toLocaleString("ru-RU")}`;

            costKitchen = unitPrices.kitchen[roomKey] * mk;
            document.getElementById('kitchen-material').textContent = `${Math.round(costKitchen * 0.97).toLocaleString("ru-RU")} - ${Math.round(costKitchen * 1.13).toLocaleString("ru-RU")}`;

            baseCost += costFloor + costWall + costDoors + costCeiling
                + costElectrics + costPlumbing + costFurniture + costKitchen;

            document.getElementById('clear-matrial').textContent = `${Math.round(baseCost * 0.97 - costLabor * 0.97).toLocaleString("ru-RU")} - ${Math.round(baseCost * 1.13 - costLabor * 1.13).toLocaleString("ru-RU")}`;
        }

        // 3) черновые материалы
        let costDraft = 0;
        document.getElementById('draft-material').parentElement.style.display = 'none';
        if (document.querySelector(".draft-material-toggle.active")) {
            costDraft = baseCost * 0.4;
            document.getElementById('draft-material').textContent = `${Math.round(costDraft * 0.97).toLocaleString("ru-RU")} - ${Math.round(costDraft * 1.13).toLocaleString("ru-RU")}`;
            document.getElementById('draft-material').parentElement.style.display = 'block';

            baseCost += costDraft;
        }

        // 4) дизайн
        let designCost = 0;
        document.getElementById('div-design').style.display = 'none';
        document.getElementById('design-cost').textContent = `0`;

        const dsel = document.querySelector(".design-option.active");
        if (dsel) {
            document.getElementById('div-design').style.display = 'block';

            const dt = dsel.textContent.trim().toLowerCase();
            if (dt === "технический") designCost = 1500 * area;
            if (dt === "2d") designCost = 3000 * area;
            if (dt === "3d") designCost = 4000 * area;
            document.getElementById('design-cost').textContent = `${Math.round(designCost * 0.97).toLocaleString("ru-RU")} - ${Math.round(designCost * 1.13).toLocaleString("ru-RU")}`;
            baseCost += designCost;
        }

        // 5) итоговый диапазон
        const low = Math.round(baseCost * 0.97);
        const high = Math.round(baseCost * 1.13);
        document.querySelectorAll(".calculator-calculation__result-total").forEach(el => el.textContent =
            `${low.toLocaleString("ru-RU")} - ${high.toLocaleString("ru-RU")}`);
            document.getElementById('cost-labor').textContent = 
                `${low.toLocaleString("ru-RU")} - ${high.toLocaleString("ru-RU")}`;

        function setHiddenField(name, value) {
            const field = document.querySelector(`[name="${name}"]`);
            if (field) field.value = value;
        }


        setHiddenField('cost-labor', document.getElementById('cost-labor').textContent);
        setHiddenField('floor-material', document.getElementById('floor-material').textContent);
        setHiddenField('walls-material', document.getElementById('walls-material').textContent);
        setHiddenField('doors-material', document.getElementById('doors-material').textContent);
        setHiddenField('ceiling-material', document.getElementById('ceiling-material').textContent);
        setHiddenField('electrics-material', document.getElementById('electrics-material').textContent);
        setHiddenField('plumbing-material', document.getElementById('plumbing-material').textContent);
        setHiddenField('furniture-material', document.getElementById('furniture-material').textContent);
        setHiddenField('kitchen-material', document.getElementById('kitchen-material').textContent);
        setHiddenField('draft-material', document.getElementById('draft-material')?.textContent || '');
        setHiddenField('design-cost', document.getElementById('design-cost')?.textContent || '');
        setHiddenField('total-cost', document.querySelector('.calculator-calculation__result-total').textContent);

        setHiddenField('clear-cost', document.getElementById('clear-matrial')?.textContent || '');
        setHiddenField('total-cost', document.getElementById('total-cost-range')?.textContent || '');

        function getActiveText(selector) {
            const el = document.querySelector(selector + ".active");
            return el ? el.textContent.trim() : "";
        }
        function getActiveToggles() {
            const toggles = [];
            document.querySelectorAll(".toggle.active").forEach(tgl => {
                const label = tgl.parentElement.querySelector("span")?.textContent.trim();
                if (label) toggles.push(label);
            });
            return toggles.join(", ");
        }
        function getMaterialSelection(labelText) {
            let selection = "";
            document.querySelectorAll(".material-row").forEach(row => {
                if (row.textContent.includes(labelText)) {
                    const activeBtn = row.querySelector(".radio-btn.active");
                    if (activeBtn) selection = activeBtn.textContent.trim();
                }
            });
            return selection;
        }
        setHiddenField('selected-room', getActiveText(".room-btn.active") || getActiveText(".studio-btn.active"));
        setHiddenField('selected-repair-type', getActiveText(".options-rem .btn.active"));
        setHiddenField('selected-property-type', getActiveText(".housing-type-group .btn.active"));
        setHiddenField('selected-toggles', getActiveToggles());
        setHiddenField('selected-design', getActiveText(".design-option.active"));
        setHiddenField('selected-floor-material', getMaterialSelection("Напольные покрытия"));
        setHiddenField('selected-wall-material', getMaterialSelection("Настенные покрытия"));
        setHiddenField('selected-doors-material', getMaterialSelection("Двери"));
        setHiddenField('selected-ceiling-material', getMaterialSelection("Потолок"));
        setHiddenField('selected-electrics-material', getMaterialSelection("Электрика"));
        setHiddenField('selected-plumbing-material', getMaterialSelection("Сантехника"));
        setHiddenField('selected-furniture-material', getMaterialSelection("Мебель"));
        setHiddenField('selected-kitchen-material', getMaterialSelection("Кухня"));
        setHiddenField('area-value', areaInput.value);


        // Скрываем строки с нулевыми значениями в модалке
        document.querySelectorAll('#div-material-clear .clear-material').forEach(row => {

            
            const val = row.querySelector('.calculator-calculation__result-value');
            if (val && (val.textContent.replace(/\s/g, '') === '0-0' || val.textContent.trim() === '0' || val.textContent.trim() === '')) {
                row.style.display = 'none';
            } else {
                row.style.display = '';
            }
        });

        let visibleIndex = 0;
        document.querySelectorAll('#div-material-clear .clear-material').forEach(row => {
            if (row.style.display !== 'none') {
                row.style.backgroundColor = visibleIndex % 2 === 0 ? '#fff' : '';
                row.style.borderRadius = visibleIndex % 2 === 0 ? '8px' : '';
                visibleIndex++;
            }
        });

    }

    // === Навешивание обработчиков ===
    document.querySelectorAll(".btn").forEach(btn =>
        btn.addEventListener("click", function () {
            const group = this.parentElement.querySelectorAll(".btn");
            group.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            calculateBudgetRepairCost();
        })
    );
    document.querySelectorAll(".room-btn, .studio-btn").forEach(btn =>
        btn.addEventListener("click", function () {
            document.querySelectorAll(".room-btn, .studio-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            calculateBudgetRepairCost();
        })
    );
    document.querySelectorAll(".toggle").forEach(tgl =>
        tgl.addEventListener("pointerdown", function (e) {
            e.stopImmediatePropagation();
            this.classList.toggle("active");
            calculateBudgetRepairCost();
            if (this.classList.contains("finish-material-toggle")) {
                setTimeout(updateMaterialCircles, 0);
            }
        })
    );

    document.querySelectorAll(".design-option").forEach(opt =>
        opt.addEventListener("click", function () {
            document.querySelectorAll(".design-option").forEach(o => o.classList.remove("active"));
            this.classList.add("active");
            calculateBudgetRepairCost();
        })
    );
    document.querySelectorAll(".radio-btn").forEach(radio =>
        radio.addEventListener("click", function () {
            if (!document.querySelector(".finish-material-toggle.active")) return;
            this.parentElement.querySelectorAll(".radio-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            calculateBudgetRepairCost();
        })
    );
    incrementButton && incrementButton.addEventListener("click", () => {
        areaInput.value = (parseInt(areaInput.value) || 0) + 1;
        calculateBudgetRepairCost();
    });
    decrementButton && decrementButton.addEventListener("click", () => {
        let v = parseInt(areaInput.value) || 0;
        if (v > 1) areaInput.value = v - 1;
        calculateBudgetRepairCost();
    });

    updateMaterialCircles();
    calculateBudgetRepairCost();

});


// Функция-обработчик для клика по радио-кнопке (можно оставить для совместимости, если вызывается inline)
function selectOption(el) {
    // Если переключатель чистовых материалов выключен, клик не обрабатывается
    if (!document.querySelector('.finish-material-toggle.active')) {
        return;
    }
    // Ищем все кнопки в группе родительского элемента
    const group = el.parentElement.querySelectorAll('.radio-btn');
    group.forEach(btn => btn.classList.remove('active'));
    el.classList.add('active');
}

const modalInfoPrice = document.querySelector('.calculator__info-container');
const modalButtonPrice = document.querySelectorAll('.modal-clc-result');


modalButtonPrice && modalButtonPrice.forEach(el => {
    const closeModalPrice = modalInfoPrice.querySelector('.close-modal-btn'); 
    el.addEventListener("click", function () {
        modalInfoPrice.classList.toggle('modal-active');
        document.documentElement.style.overflow = 'hidden';
        const modalBack = document.querySelector('.back-btn');
        const closeModal = () => {
            modalInfoPrice.classList.remove('modal-active');
            document.documentElement.style.overflow = '';
        };
        closeModalPrice && closeModalPrice.addEventListener('click', closeModal);
        modalBack && modalBack.addEventListener('click', closeModal);
        modalInfoPrice.addEventListener('click', e => {
            if (!e.target.closest('.calculator__info-block')) {
                closeModal();
            }
        });
    })
})

  jQuery(function($) {
    $('.button-open-options').on('click', function() {
      const $wrap = $('.calc-radio-group-wrap');
      $wrap.stop(true, true).slideToggle(400).toggleClass('active');
    });
  
  });

  const optionsButton = document.querySelector('.button-open-additional-options');
  const optionsModal = document.querySelector('.calculator-additional-modal');
  const closeMod = document.querySelector('.close-modal-btn'); 
  const closeModBtn = document.querySelectorAll('.close-additional-modal'); 
  const modalContent = optionsModal && optionsModal.querySelector('.modal-content'); 
  
  if (optionsButton && optionsModal) {
      optionsButton.addEventListener('click', () => {
          optionsModal.classList.add('additional-active');
          document.documentElement.style.overflow = 'hidden';
      });
  
      const closeModal = () => {
          optionsModal.classList.remove('additional-active');
          document.documentElement.style.overflow = '';
      };
  
      closeMod && closeMod.addEventListener('click', closeModal);
      closeModBtn.forEach(btn => btn.addEventListener('click', closeModal));
  
      optionsModal.addEventListener('click', e => {
          if (!e.target.closest('.modal-content')) {
              closeModal();
          }
      });
  }
