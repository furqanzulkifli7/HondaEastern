(function() {
  "use strict"; // Start of use strict

  var mainNav = document.querySelector('#mainNav');

  if (mainNav) {

    var navbarCollapse = mainNav.querySelector('.navbar-collapse');
    
    if (navbarCollapse) {
      
      var collapse = new bootstrap.Collapse(navbarCollapse, {
        toggle: false
      });
      
      var navbarItems = navbarCollapse.querySelectorAll('a');
      
      // Closes responsive menu when a scroll trigger link is clicked
      for (var item of navbarItems) {
        item.addEventListener('click', function (event) {
          collapse.hide();
        });
      }
    }

    // Collapse Navbar
    var collapseNavbar = function() {

      var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

      if (scrollTop > 100) {
        mainNav.classList.add("navbar-shrink");
      } else {
        mainNav.classList.remove("navbar-shrink");
      }
    };
    // Collapse now if page is not at top
    collapseNavbar();
    // Collapse the navbar when page is scrolled
    document.addEventListener("scroll", collapseNavbar);

    // Hide navbar when modals trigger
    var modals = document.querySelectorAll('.portfolio-modal');
      
    for (var modal of modals) {
      
      modal.addEventListener('shown.bs.modal', function (event) {
        mainNav.classList.add('d-none');
      });
        
      modal.addEventListener('hidden.bs.modal', function (event) {
        mainNav.classList.remove('d-none');
      });
    }
  }

})(); // End of use strict

$(document).ready(function() {
  var owl = $('#promotion .owl-carousel');
  owl.owlCarousel({
    margin: 10,
    nav: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      900: {
        items: 2
      },
      1400: {
        items: 3
      }
    }
  });

  // Owl locks in each item's width when it initialises. On a cold load the promo
  // images have not downloaded yet, so they measure 0 wide, the col-xl-auto wrapper
  // shrinks to nothing, and every item gets width 0 - the carousel renders blank
  // until you refresh and the images come from cache. Re-measure once they arrive.
  var refresh = function() { owl.trigger('refresh.owl.carousel'); };
  owl.find('img').each(function() {
    if (!this.complete) $(this).one('load error', refresh);
  });
  $(window).on('load', refresh);
});

$(document).ready(function() {
  console.log("Owl carousel");
  var owl2 = $('#services .mobile-services .owl-carousel');
  console.log(owl2);
  // Target only the owl-carousel inside mobile-services
  owl2.owlCarousel({
    margin: 10,
    nav: true,
    autoplay:true,
    autoplayTimeout:4000,
    loop: true,
    lazyLoad:true,
    responsive: { 
      0: {
        items: 1
      },
      770: {
        items: 2
      },
    }
  })
})

document.addEventListener("DOMContentLoaded", function() {

    // Navbar shrink function
    var navbarShrink = function () {
      const navbarCollapsible = document.body.querySelector('#mainNav');
      if (!navbarCollapsible) {
          return;
      }
      if (window.scrollY === 0) {
          navbarCollapsible.classList.add('navbar-shrink')
          //navbarCollapsible.classList.remove('navbar-shrink')
      } else {
          navbarCollapsible.classList.add('navbar-shrink')
      }

  };

  // Shrink the navbar 
  navbarShrink();

  // Shrink the navbar when page is scrolled
  document.addEventListener('scroll', navbarShrink);

          // Automatically click the first radio button
          const firstRadioButton = document.querySelector('.piotnetforms-field-subgroup input[type="radio"]');

          if (firstRadioButton) {
              firstRadioButton.checked = true;
              detectDownPaymentOption();
          }

          const enterAmountRadio = document.getElementById("form-field-downpayment_type-1");

          if (enterAmountRadio) {
              firstRadioButton.checked = true;
          }
  //  Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector('#mainNav');
  if (mainNav) {
      new bootstrap.ScrollSpy(document.body, {
          target: '#mainNav',
          rootMargin: '0px 0px -40%',
      });
  };

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector('.navbar-toggler');
  const responsiveNavItems = [].slice.call(
      document.querySelectorAll('#navbarResponsive .nav-link')
  );
  responsiveNavItems.map(function (responsiveNavItem) {
      responsiveNavItem.addEventListener('click', () => {
          if (window.getComputedStyle(navbarToggler).display !== 'none') {
              navbarToggler.click();
          }
      });
  });
});


// The <option> values in #car-model ARE the prices in RM (generated from
// prices.json), so the select is the source of truth. Nothing needs to be
// parsed back out of the formatted string the customer sees.
function selectedCarPrice() {
  const price = parseFloat(document.getElementById('car-model').value);
  return isNaN(price) ? 0 : price;
}

function formatRM(value) {
  return "RM " + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateLoanAmount() {
  const price = selectedCarPrice();

  // The "RM " prefix is a literal text node in the markup, so this span holds
  // the number only.
  document.getElementById('hargakereta').textContent =
    price > 0 ? price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0';

  document.getElementById('downpaymentval').value = 0;

  calculate();
}


// Hire-Purchase (Amendment) Act 2026 — gazetted 30 January 2026, in force
// 1 June 2026 — ended flat-rate and Rule of 78 interest on new hire purchase
// agreements. Interest is now charged on the REDUCING BALANCE and the rate is
// quoted as an effective interest rate (EIR), so the instalment is the standard
// amortisation formula already implemented in calculatePayment() below.
//
// The rate is NOT interchangeable with the flat rate this calculator used until
// September 2026. An EIR is roughly 1.9x the flat rate that yields the same
// instalment (3.5% flat over 5 years == 6.54% EIR), so feeding an old flat rate
// into this formula understates the monthly payment by around 11%. The slider
// range in index.html was rebased to EIR at the same time as this change — keep
// the two in step.
// The flat-rate equivalent of an EIR. The principal cancels out, so this needs
// only the rate and the tenure — no car, no deposit, no Calculate click. It is
// a restatement of the rate the customer has dialled in, not a result of the
// loan, which is why it is computed here and not inside calculate().
//
// Verified against RinggitPlus' flat-to-EIR converter: RM100,000 over 5 years at
// 3.00% flat is RM115,000 total and 5.64% EIR, which is what this returns.
// Note the figure moves with tenure — 3.00% flat is 5.68% EIR over 3 years and
// 5.50% over 9 — so the repayment period has to be part of the calculation.
function flatRateEquivalent(eir, years) {
  const i = eir / 100 / 12;
  const months = years * 12;
  if (i === 0) return 0;
  const g = Math.pow(1 + i, months);
  // Total repaid per RM1 borrowed, less the RM1 of principal, spread per year.
  const totalPerRinggit = ((i * g) / (g - 1)) * months;
  return ((totalPerRinggit - 1) / years) * 100;
}

// Keeps the grey "equivalent flat rate" line under the EIR label in step with
// the slider. Safe to call at any time — it never depends on a chosen variant.
function updateFlatEquivalent() {
  const flatEl = document.getElementById('flat-equivalent');
  if (!flatEl) return;

  const years = parseFloat(document.getElementById('form-field-repayment_period').value);
  const eir = parseFloat(jQuery('#form-field-annual_interest').val());

  flatEl.textContent = (years > 0 && eir > 0)
    ? flatRateEquivalent(eir, years).toFixed(2) + '%'
    : '—'; // escaped so it survives any charset header
}

function calculate() {
  const price = selectedCarPrice();
  const downpayment = parseFloat(document.getElementById('downpaymentval').value) || 0;
  const principal = price - downpayment;
  const years = parseFloat(document.getElementById('form-field-repayment_period').value);
  const eir = parseFloat(jQuery('#form-field-annual_interest').val());

  const monthlyEl = document.getElementById('monthval');
  const totalPaidEl = document.getElementById('totalPaid');
  const totalInterestEl = document.getElementById('totalInterest');

  // Always current, even with no variant chosen — it only describes the rate.
  updateFlatEquivalent();

  // No variant picked yet, or a deposit that covers the whole car.
  if (!(principal > 0) || !(years > 0) || isNaN(eir)) {
    monthlyEl.textContent = null;
    totalPaidEl.textContent = null;
    totalInterestEl.textContent = null;
    return;
  }

  const months = years * 12;
  const monthly = calculatePayment(principal, months, eir);
  const totalPaid = monthly * months;
  const totalInterest = totalPaid - principal;

  monthlyEl.textContent = formatRM(monthly);
  totalPaidEl.textContent = formatRM(totalPaid);
  totalInterestEl.textContent = formatRM(totalInterest);
}

function calculatePayment(finAmount, finMonths, finInterest){
	var result = 0;

	if(finInterest == 0){
		result = finAmount / finMonths;
	}
	else{
		var i = ((finInterest/100) / 12),
			i_to_m = Math.pow((i + 1), finMonths),
			p = finAmount * ((i * i_to_m) / (i_to_m - 1));
		result = Math.round(p * 100) / 100;
	}

	return result;
}

function currencyFormat(price){
	return '$' + price.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function detectDownPaymentOption() {
  const enterAmountRadio = document.getElementById("form-field-downpayment_type-1");
  var downpaymentField = document.getElementById('downpaymentval');

 if (enterAmountRadio.checked) {
    downpaymentField.disabled = false;
    downpaymentField.style.color = "black"; // Reset text color
    downpaymentField.style.backgroundColor = ""; // Reset background color
    
    console.log("Enter Amount selected");
    // Do something when Enter Amount is selected
  } else {
    console.log("No option selected");
  }

  //calculate(); // ni bila tekan enter still jadi
}

// Deliberately does not recalculate. As with the interest slider, the figures
// only update when Calculate is clicked. calculate() does now guard an empty or
// over-large deposit, so this is a one-liner to switch on if that ever changes.
function CheckIfNoDownPayment()
{
    //calculate();
}


//For car calculation
const data = {
  "options": [
    {
      "label": "Honda City",
      "options": [
        {"label": "City 1.5L E", "value": "89900"},
        {"label": "City 1.5L V", "value": "94900"},
        {"label": "City 1.5L RS", "value": "99900"},
        {"label": "City 1.5L e:HEV RS", "value": "111900"}
      ]
    },
    {
      "label": "Honda City Hatchback",
      "options": [
        {"label": "City Hatchback 1.5L V", "value": "95900"},
        {"label": "City Hatchback 1.5L RS", "value": "100900"},
        {"label": "City Hatchback 1.5L e:HEV RS", "value": "112900"}
      ]
    },
    {
      "label": "Honda Civic",
      "options": [
        {"label": "Civic 1.5L E", "value": "133900"},
        {"label": "Civic 1.5L V", "value": "144900"},
        {"label": "Civic 1.5L RS", "value": "149900"},
        {"label": "Civic e:HEV 2.0L RS", "value": "167900"}
      ]
    },
    {
      "label": "Honda HR-V",
      "options": [
        {"label": "HR-V 1.5L S", "value": "115900"},
        {"label": "HR-V 1.5L T E", "value": "130900"},
        {"label": "HR-V 1.5L T V", "value": "137900"},
        {"label": "HR-V 1.5L e:HEV RS", "value": "143900"}
      ]
    },
    {
      "label": "Honda WR-V",
      "options": [
        {"label": "WR-V 1.5L E", "value": "94900"},
        {"label": "WR-V 1.5L V", "value": "98900"},
        {"label": "WR-V 1.5L RS", "value": "104900"}
      ]
    },
    {
      "label": "Honda CR-V",
      "options": [
        {"label": "CR-V 2.0L e:HEV E", "value": "178200"},
        {"label": "CR-V 1.5L V AWD", "value": "181900"},
        {"label": "CR-V 2.0L e:HEV RS", "value": "195900"}
      ]
    },
    {
      "label": "Honda Civic Type R",
      "options": [
        {"label": "Type R", "value": "399900"}
      ]
    },
    {
      "label": "Honda Prelude",
      "options": [
        {"label": "Prelude 2.0L e:HEV", "value": "278000"}
      ]
    }
  ]
};

window.onload = () => {
    const selectElement = document.getElementById('car-model');

    data.options.forEach(group => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = group.label;

        group.options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.label;
            opt.setAttribute('data-piotnetforms-send-data-by-label', option.label);
            optgroup.appendChild(opt);
        });

        selectElement.appendChild(optgroup);
    });
};


//Open tab
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display   
 = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display   
 = "block";
  evt.currentTarget.className += " active";   

}

//Car Table

const carData = {
  'Honda City'            : {
      'Variant 1': {
        'Engine': [
            '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
            '1,498 Displacement (CC)',
            'Max Torque : 145 Nm,  14.8 kg-m and 4300 rpm',
            'Max Power : 121 PS , 89 kW and 6600 rpm',
            'Electronic Fuel Injection (PGM‑FI)',
            'Continuous Variable Transmission (CVT)',
            'Electric Power Steering (EPS)'
        ],
        'Perfomance': [
            '196 km/h Maximum speed',
            '10.2s of Accelaration of 0-100 km/h (secs)',
            'Fuel Consumption (L/100km) : 5.6'
        ],
        'Brake System': [
          'Front :	Ventilated Disc',
          'Rear :	Drum',
          'Parking Brake :	Hand Brake Lever'
        ],
        'Suspension System':[
          'Front : MacPherson Strut',
          'Rear : Torsion Beam'
        ],
        'Dimension': [
          'Length (mm)	4,577',
          'Width (mm)	1,748',
          'Height (mm)	1,467',
          'Wheelbase (mm)	2,600',
          'Tread Front (mm)	1,495',
          'Tread Rear (mm)	1,483',
          'Curb Weight (kg)	1,126',
          'Boot Capacity (Litre)	519'
        ],
        'Tyres' :[
          'Wheel Type : Alloy',
          'Wheel Size :	15',
          'Tyre Size	: 185/60R15',
          'Spare Tyre Size : Temporary Repair Kit'
        ],
        'Exterior' : [
           'Headlights	: Bi-LED Projector',
            'Auto Headlights : ✓',	
            'Daytime Running Lights	: LED',
            'Front Fog Lights : -',
            'Side Mirrors With Turning Lights : ✓',	
            'Outer Door Handle : Body Colour',
            'Trunk Spoiler : - ',
            'Rear Combi Lights : LED',
            'Antenna	: Shark Fin'
        ],
        'Control & Interior' :[
          'Remote Engine Start : ✓',
          'Walk Away Auto Lock : ✓',
          'Smart Entry with Push Start Button : ✓',
          'Paddle Shift : ✓',
          'Deceleration Selector Paddle	: -',
          'Meter Cluster : 4.2” TFT Meter',
          'Air Conditioning	: Single Auto',
          'Rear Air Conditioning Ventilation : ✓',
          'Steering Wheel :	Urethane',
          'Gear Knob Type	: Urethane',
          'Upholstery	: Fabric',
          '60:40 Seats : ✓',
          'Steering Wheel Switch Audio Control : ✓',
          'Pedal Pad Type	: Normal',
          'Power Adjustable Door Mirror : ✓',
          'Power Retractable Door Mirror : ✓',
          'Centre Console with Armrest	: ✓',
            'Ambient Lighting	: -',
            'Wireless Charger	: -',
            'Auto Dim Rearview Mirror	: -',
          'Rear USB Charger : 2'
        ],
        'Audio':[
          '8" Display Audio',
          'Apple CarPlay™ & Android Auto™ Connectivity* : ✓ ',
          'USB Port	: 2',
          'Hands‑Free Telephone (HFT) : ✓',
          'Speakers	: 4',
          'Bluetooth	: ✓',
          'Tweeter	: 4'
        ],
        'Safety & Security':[
          'Dual Front SRS Airbags	: ✓',
          'Side Airbags	: ✓',
          'Side Curtain Airbags	: ✓',
          'Driver Seatbelt Reminder	: ✓',
          'Assistant Seatbelt Reminder	: ✓',
          'Rear Seatbelt Reminder	: ✓',
          'ISOFIX I‑Size Type	: ✓',
          'Vehicle Stability Assist (VSA)	: ✓',
          'Anti‑lock Braking System (ABS)	: ✓',
          'Electronic Brake Distribution (EBD)	: ✓',
          'Brake Assist (BA)	: ✓',
          'Auto Brake Hold (ABH)	: -',
          'Hill Start Assist (HSA)	: ✓',
          'Emergency Stop Signal (ESS)	: ✓',
          'Reverse Sensors	2',
          'Reverse Camera	: Multi-angle',
            '360-Degree Multi-View Camera	: -',
            'Blind Spot Information (BSI) with Rear Cross Traffic Alert	: ✓',
          'Honda LaneWatch Camera (LWC)	✓',
          'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, AHB, LSF, LCDN) : -',
          'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, AHB, LCDN)	: ✓',
          'Forward Collision Warning (FCW)	: ✓',
          'Collision Mitigation Braking System (CMBS)	: ✓',
          'Lane Keep Assist System (LKAS)	: ✓',
          'Lane Departure Warning (LDW)	: ✓',
          'Road Departure Mitigation (RDM)	: ✓',
          'Adaptive Cruise Control (ACC)	: ✓',
          'Low Speed Follow (LSF)	: -',
          'Auto High Beam (AHB)	: ✓',
          'Lead Car Departure Notification (LCDN)	: ✓',
          'Honda CONNECT (Safety, Security, Convenience) : -',
          'Security Alarm with Immobiliser	: ✓'
        ]
      },
       'Variant 2': {
          'Engine': [
              '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
              '1,498 Displacement (CC)',
              'Max Torque : 145 Nm,  14.8 kg-m and 4300 rpm',
              'Max Power : 121 PS , 89 kW and 6600 rpm',
              'Electronic Fuel Injection (PGM‑FI)',
              'Continuous Variable Transmission (CVT)',
              'Electric Power Steering (EPS)'
          ],
          'Perfomance': [
              '196 km/h Maximum speed',
              '10.2s of Accelaration of 0-100 km/h (secs)',
              'Fuel Consumption (L/100km) : 5.6'
          ],
          'Brake System': [
            'Front :	Ventilated Disc',
            'Rear :	Drum',
            'Parking Brake :	Hand Brake Lever'
          ],
          'Suspension System':[
            'Front : MacPherson Strut',
            'Rear : Torsion Beam'
          ],
          'Dimension': [
            'Length (mm)	4,577',
            'Width (mm)	1,748',
            'Height (mm)	1,467',
            'Wheelbase (mm)	2,600',
            'Tread Front (mm)	1,495',
            'Tread Rear (mm)	1,483',
            'Curb Weight (kg)	1,126',
            'Boot Capacity (Litre)	519'
          ],
          'Tyres' :[
            'Wheel Type : Alloy',
            'Wheel Size :	16',
            'Tyre Size	: 185/55R16 (Turbine-style Shark Grey Alloy)',
            'Spare Tyre Size : Temporary Repair Kit'
          ],
          'Exterior' : [
            'Headlights	: Bi-LED Projector',
              'Auto Headlights : ✓',	
              'Daytime Running Lights	: LED',
              'Front Fog Lights : -',
              'Side Mirrors With Turning Lights : ✓',	
              'Outer Door Handle : Body Colour',
              'Trunk Spoiler : - ',
              'Rear Combi Lights : LED',
              'Antenna	: Shark Fin'
          ],
          'Control & Interior' :[
            'Remote Engine Start : ✓',
            'Walk Away Auto Lock : ✓',
            'Smart Entry with Push Start Button : ✓',
            'Paddle Shift : ✓',
            'Deceleration Selector Paddle	: -',
            'Meter Cluster : 4.2” TFT Meter',
            'Air Conditioning	: Single Auto',
            'Rear Air Conditioning Ventilation : ✓',
            'Steering Wheel :	Urethane',
            'Gear Knob Type	: Urethane',
            'Upholstery	: Fabric',
            '60:40 Seats : ✓',
            'Steering Wheel Switch Audio Control : ✓',
            'Pedal Pad Type	: Normal',
            'Power Adjustable Door Mirror : ✓',
            'Power Retractable Door Mirror : ✓',
            'Centre Console with Armrest	: ✓',
            'Ambient Lighting	: ✓ Blue',
            'Wireless Charger	: -',
            'Auto Dim Rearview Mirror	: -',
            'Rear USB Charger : 2'
          ],
          'Audio':[
            '10" Display Audio',
            'Apple CarPlay™ & Android Auto™ Connectivity* : ✓ Wireless',
            'USB Port	: 2',
            'Hands‑Free Telephone (HFT) : ✓',
            'Speakers	: 4',
            'Bluetooth	: ✓',
            'Tweeter	: 4'
          ],
          'Safety & Security':[
            'Dual Front SRS Airbags	: ✓',
            'Side Airbags	: ✓',
            'Side Curtain Airbags	: ✓',
            'Driver Seatbelt Reminder	: ✓',
            'Assistant Seatbelt Reminder	: ✓',
            'Rear Seatbelt Reminder	: ✓',
            'ISOFIX I‑Size Type	: ✓',
            'Vehicle Stability Assist (VSA)	: ✓',
            'Anti‑lock Braking System (ABS)	: ✓',
            'Electronic Brake Distribution (EBD)	: ✓',
            'Brake Assist (BA)	: ✓',
            'Auto Brake Hold (ABH)	: -',
            'Hill Start Assist (HSA)	: ✓',
            'Emergency Stop Signal (ESS)	: ✓',
            'Reverse Sensors	2',
            'Reverse Camera	: Multi-angle',
            '360-Degree Multi-View Camera	: ✓ with Moving Object Detection',
            'Blind Spot Information (BSI) with Rear Cross Traffic Alert	: ✓',
            'Honda LaneWatch Camera (LWC)	✓',
            'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, AHB, LSF, LCDN) : -',
            'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, AHB, LCDN)	: ✓',
            'Forward Collision Warning (FCW)	: ✓',
            'Collision Mitigation Braking System (CMBS)	: ✓',
            'Lane Keep Assist System (LKAS)	: ✓',
            'Lane Departure Warning (LDW)	: ✓',
            'Road Departure Mitigation (RDM)	: ✓',
            'Adaptive Cruise Control (ACC)	: ✓',
            'Low Speed Follow (LSF)	: -',
            'Auto High Beam (AHB)	: ✓',
            'Lead Car Departure Notification (LCDN)	: ✓',
            'Honda CONNECT (Safety, Security, Convenience) : -',
            'Security Alarm with Immobiliser	: ✓'
          ]
      },
      'Variant 3': {
        'Engine': [
            '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
            '1,498 Displacement (CC)',
            'Max Torque : 145 Nm,  14.8 kg-m and 4300 rpm',
            'Max Power : 121 PS , 89 kW and 6600 rpm',
            'Electronic Fuel Injection (PGM‑FI)',
            'Continuous Variable Transmission (CVT)',
            'Electric Power Steering (EPS)'
        ],
        'Perfomance': [
            '196 km/h Maximum speed',
            '10.2s of Accelaration of 0-100 km/h (secs)',
            'Fuel Consumption (L/100km) : 5.6'
        ],
        'Brake System': [
          'Front :	Ventilated Disc',
          'Rear :	Drum',
          'Parking Brake :	Hand Brake Lever'
        ],
        'Suspension System':[
          'Front : MacPherson Strut',
          'Rear : Torsion Beam'
        ],
        'Dimension': [
          'Length (mm)	4,594',
          'Width (mm)	1,748',
          'Height (mm)	1,467',
          'Wheelbase (mm)	2,600',
          'Tread Front (mm)	1,495',
          'Tread Rear (mm)	1,483',
          'Curb Weight (kg)	1,126',
          'Boot Capacity (Litre)	519'
        ],
        'Tyres' :[
          'Wheel Type : Alloy',
          'Wheel Size :	16',
          'Tyre Size	: 185/55R16 (Berlina Black Alloy)',
          'Spare Tyre Size : Temporary Repair Kit'
        ],
        'Exterior' : [
          'Headlights	: Bi-LED Projector',
            'Auto Headlights : ✓',	
            'Daytime Running Lights	: LED',
            'Front Fog Lights : -',
            'Side Mirrors With Turning Lights : ✓',	
            'Outer Door Handle : Black',
            'Trunk Spoiler : ✓ Black',
            'Rear Combi Lights : LED',
            'Antenna	: Shark Fin'
        ],
        'Control & Interior' :[
          'Remote Engine Start : ✓',
          'Walk Away Auto Lock : ✓',
          'Smart Entry with Push Start Button : ✓',
          'Paddle Shift : ✓',
          'Deceleration Selector Paddle	: -',
          'Meter Cluster : 4.2” TFT Meter',
          'Air Conditioning	: Single Auto',
          'Rear Air Conditioning Ventilation : ✓',
          'Steering Wheel :	Urethane',
          'Gear Knob Type	: Urethane',
          'Upholstery	: RS Design with Red Accents',
          '60:40 Seats : ✓',
          'Steering Wheel Switch Audio Control : ✓',
          'Pedal Pad Type	: Normal',
          'Power Adjustable Door Mirror : ✓',
          'Power Retractable Door Mirror : ✓',
          'Centre Console with Armrest	: ✓',
            'Ambient Lighting	: ✓ Red',
            'Wireless Charger	: -',
            'Auto Dim Rearview Mirror	: ✓',
          'Rear USB Charger : 2'
        ],
        'Audio':[
          '10" Display Audio',
          'Apple CarPlay™ & Android Auto™ Connectivity* : ✓ Wireless',
          'USB Port	: 2',
          'Hands‑Free Telephone (HFT) : ✓',
          'Speakers	: 4',
          'Bluetooth	: ✓',
          'Tweeter	: 4'
        ],
        'Safety & Security':[
          'Dual Front SRS Airbags	: ✓',
          'Side Airbags	: ✓',
          'Side Curtain Airbags	: ✓',
          'Driver Seatbelt Reminder	: ✓',
          'Assistant Seatbelt Reminder	: ✓',
          'Rear Seatbelt Reminder	: ✓',
          'ISOFIX I‑Size Type	: ✓',
          'Vehicle Stability Assist (VSA)	: ✓',
          'Anti‑lock Braking System (ABS)	: ✓',
          'Electronic Brake Distribution (EBD)	: ✓',
          'Brake Assist (BA)	: ✓',
          'Auto Brake Hold (ABH)	: -',
          'Hill Start Assist (HSA)	: ✓',
          'Emergency Stop Signal (ESS)	: ✓',
          'Reverse Sensors	2',
          'Reverse Camera	: Multi-angle',
            '360-Degree Multi-View Camera	: ✓ with Moving Object Detection',
            'Blind Spot Information (BSI) with Rear Cross Traffic Alert	: ✓',
          'Honda LaneWatch Camera (LWC)	✓',
          'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, AHB, LSF, LCDN) : -',
          'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, AHB, LCDN)	: ✓',
          'Forward Collision Warning (FCW)	: ✓',
          'Collision Mitigation Braking System (CMBS)	: ✓',
          'Lane Keep Assist System (LKAS)	: ✓',
          'Lane Departure Warning (LDW)	: ✓',
          'Road Departure Mitigation (RDM)	: ✓',
          'Adaptive Cruise Control (ACC)	: ✓',
          'Low Speed Follow (LSF)	: -',
          'Auto High Beam (AHB)	: ✓',
          'Lead Car Departure Notification (LCDN)	: ✓',
          'Honda CONNECT (Safety, Security, Convenience) : -',
          'Security Alarm with Immobiliser	: ✓'
        ]
      },
      'Variant 4': {
        'Engine': [
            '1.5 litre DOHC i-VTEC naturally-aspirated Atkinson-cycle four-cylinder engine',
            '1,498 Displacement (CC)',
            '98 PS (97 hp) at 5,600 to 6,400 rpm, 127 Nm at 4,500 to 5,000 rpm',
            'Electric motor with 108 PS (107 hp) and 253 Nm from 0 to 3,000 rpm',
            'Electronic Fuel Injection (PGM‑FI)',
            'Electric Continuous Variable Transmission (e‑CVT)',
            'Electric Power Steering (EPS)'
        ],
        'Perfomance': [
            '177 km/h Maximum speed',
            '9.9s of Accelaration of 0-100 km/h (secs)',
            'Fuel Consumption (L/100km) : 5.6'
        ],
        'Brake System': [
          'Front :	Ventilated Disc',
          'Rear :	Solid Disc',
          'Parking Brake :	Electric Parking Brake'
        ],
        'Suspension System':[
          'Front : MacPherson Strut',
          'Rear : Torsion Beam'
        ],
        'Dimension': [
          'Length (mm)	4,594',
          'Width (mm)	1,748',
          'Height (mm)	1,467',
          'Wheelbase (mm)	2,600',
          'Tread Front (mm)	1,495',
          'Tread Rear (mm)	1,485',
          'Curb Weight (kg)	1,250',
          'Boot Capacity (Litre)	410'
        ],
        'Tyres' :[
          'Wheel Type : Alloy',
          'Wheel Size :	16',
          'Tyre Size	: 185/55R16 (Berlina Black Alloy)',
          'Spare Tyre Size : Temporary Repair Kit'
        ],
        'Exterior' : [
          'Headlights	: Bi-LED Projector',
            'Auto Headlights : ✓',	
            'Daytime Running Lights	: LED',
            'Front Fog Lights : LED',
            'Side Mirrors With Turning Lights : ✓',	
            'Outer Door Handle : Black',
            'Trunk Spoiler : ✓',
            'Rear Combi Lights : LED',
            'Antenna	: Shark Fin'
        ],
        'Control & Interior' :[
          'Remote Engine Start : ✓',
          'Walk Away Auto Lock : ✓',
          'Smart Entry with Push Start Button : ✓',
          'Paddle Shift : -',
          'Deceleration Selector Paddle	: ✓',
          'Meter Cluster : 7" TFT Meter',
          'Air Conditioning	: Single Auto',
          'Rear Air Conditioning Ventilation : ✓',
          'Steering Wheel :	Leather',
          'Gear Knob Type	: Leather',
          'Upholstery	: Leather',
          '60:40 Seats : ✓',
          'Steering Wheel Switch Audio Control : ✓',
          'Pedal Pad Type	: Normal',
          'Power Adjustable Door Mirror : ✓',
          'Power Retractable Door Mirror : ✓',
          'Centre Console with Armrest	: ✓',
            'Ambient Lighting	: ✓ Red',
            'Wireless Charger	: ✓',
            'Auto Dim Rearview Mirror	: ✓',
          'Rear USB Charger : 2'
        ],
        'Audio':[
          '10" Display Audio',
          'Apple CarPlay™ & Android Auto™ Connectivity* : Wireless',
          'USB Port	: 2',
          'Hands‑Free Telephone (HFT) : ✓',
          'Speakers	: 4',
          'Bluetooth : ✓',
          'Tweeter	: 4'
        ],
        'Safety & Security':[
          'Dual Front SRS Airbags	: ✓',
          'Side Airbags	: ✓',
          'Side Curtain Airbags	: ✓',
          'Driver Seatbelt Reminder	: ✓',
          'Assistant Seatbelt Reminder	: ✓',
          'Rear Seatbelt Reminder	: ✓',
          'ISOFIX I‑Size Type	: ✓',
          'Vehicle Stability Assist (VSA)	: ✓',
          'Anti‑lock Braking System (ABS)	: ✓',
          'Electronic Brake Distribution (EBD)	: ✓',
          'Brake Assist (BA)	: ✓',
          'Auto Brake Hold (ABH)	: ✓',
          'Hill Start Assist (HSA)	: ✓',
          'Emergency Stop Signal (ESS)	: ✓',
          'Reverse Sensors	2',
          'Reverse Camera	: Multi-angle',
            '360-Degree Multi-View Camera	: ✓ with Moving Object Detection',
            'Blind Spot Information (BSI) with Rear Cross Traffic Alert	: ✓',
          'Honda LaneWatch Camera (LWC)	✓',
          'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, AHB, LSF, LCDN) : ✓',
          'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, AHB, LCDN)	: -',
          'Forward Collision Warning (FCW)	: ✓',
          'Collision Mitigation Braking System (CMBS)	: ✓',
          'Lane Keep Assist System (LKAS)	: ✓',
          'Lane Departure Warning (LDW)	: ✓',
          'Road Departure Mitigation (RDM)	: ✓',
          'Adaptive Cruise Control (ACC)	: ✓',
          'Low Speed Follow (LSF)	: ✓',
          'Auto High Beam (AHB)	: ✓',
          'Lead Car Departure Notification (LCDN)	: ✓',
          'Honda CONNECT (Safety, Security, Convenience) : ✓',
          'Security Alarm with Immobiliser	: ✓'
        ]
    },
      // Add more variants here
  },
  'Honda City Hatchback'  : {
        'Variant 1': {
          'Engine & Perfomance': [
            '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
            '121 PS (119 hp) at 6,600 rpm, 145 Nm at 4,300 rpm',
            'Electronic Fuel Injection (PGM‑FI)',
            'Continuous Variable Transmission (CVT) with Econ mode',
            'Electric Power Steering (EPS)'
          ],
          'Perfomance': [
            '0-100 km/h in 10.7 seconds',
            'Maximum speed of 195 (km/h)',
            'Fuel consumption of 5.6 (L/100km)'
          ],
          'Brake System': [
            'Front : Ventilated Disc',
            'Rear : Solid Disc',
            'Parking Brake : Hand Brake Lever'
          ],
          'Suspension System': [
            'Front : MacPherson Strut',
            'Rear : Torsion Beam'
          ],
          'Dimension': [
            'Length (mm) 4,362',
            'Width (mm) 1,748',
            'Height (mm) 1,488',
            'Wheelbase (mm) 2,600',
            'Tread Front (mm) 1,495',
            'Tread Rear (mm) 1,483',
            'Curb Weight (kg) 1,148',
            'Fuel Tank Capacity (litre) 40',
            'Boot Capacity (Litre) 289'
          ],
          'Tyres': [
            'Wheel Type : Alloy',
            'Wheel Size : 16',
            'Tyre Size : 185/55R16',
            'Spare Tyre : Temporary repair kit (no spare tyre)'
          ],
          'Exterior': [
            'Headlights : Bi-LED',
            'Auto Headlights : ✓',
            'Daytime Running Lights : LED',
            'Side Mirrors with Turning Lights : ✓',
            'Auto Front Wiper : -',
            'Rear Wiper System : Intermittent',
            'Outer Door Handle : Body Colour',
            'Rear Combi Lights : LED',
            'Antenna : Shark Fin'
          ],
          'Control & Interior': [
            'Remote Engine Start : ✓',
            'Walk Away Auto Lock : ✓',
            'Smart Entry with Push Start Button : ✓',
            'Paddle Shift : ✓',
            'Deceleration Selector Paddle : -',
            'ECON Button : ✓',
            'Meter Cluster : 7” TFT Meter',
            'Air Conditioning : Single Auto',
            'Rear Air Conditioning Ventilation : ✓',
            'Steering Wheel : Leather^',
            'Gear Knob Type : Leather^',
            'Upholstery : Leather^',
            'ULTRA Seat : ✓',
            'Steering Wheel Switch Audio Control : ✓',
            'Pedal Pad Type : Normal',
            'Power Adjustable Door Mirror : ✓',
            'Auto Retractable Door Mirror : ✓',
            'Center Console with Armrest : ✓',
            'Front Panel Ambient Light : ✓',
            'Door Pocket, Front Foot, Front Door Inner Handle Light : ✓',
            'Wireless Charger : -',
            'Rear USB Charger : 2'
          ],
          'Audio': [
            'Audio System : 10” Display Audio',
            'Apple CarPlay™ & Android Auto™ Connectivity* : Wireless',
            'USB Port : 2',
            'Hands-Free Telephone (HFT) : ✓',
            'Speakers : 4',
            'Bluetooth : ✓',
            'Tweeter : 4'
          ],
          'Safety & Security': [
            'Dual Front SRS Airbags : ✓',
            'Side Airbags : ✓',
            'Side Curtain Airbags : ✓',
            'Driver Seatbelt Reminder : ✓',
            'Assistant Seatbelt Reminder : ✓',
            'Rear Seatbelt Reminder : ✓',
            'ISOFIX I-Size Type : ✓',
            'Auto Door Lock : ✓',
            'Vehicle Stability Assist (VSA) : ✓',
            'Anti-lock Braking System (ABS) : ✓',
            'Electronic Brake Distribution (EBD) : ✓',
            'Auto Brake Hold (ABH) : -',
            'Hill Start Assist (HSA) : ✓',
            'Emergency Stop Signal (ESS) : ✓',
            'Reverse Sensors : 2',
            'Reverse Camera : ✓',
            'Multi-View Camera System (MVCS) : -',
            'Blind Spot Information with Cross Traffic Monitoring (BSI with CTM) : ✓',
            'Honda LaneWatch Camera (LWC) : ✓',
            'Forward Collision Warning (FCW) : ✓',
            'Collision Mitigation Braking System (CMBS) : ✓',
            'Lane Keep Assist System (LKAS) : ✓',
            'Lane Departure Warning (LDW) : ✓',
            'Road Departure Mitigation (RDM) : ✓',
            'Adaptive Cruise Control (ACC) : ✓',
            'Low Speed Follow (LSF) : -',
            'Auto High Beam (AHB) : ✓',
            'Lead Car Departure Notification (LCDN) : ✓',
            'Honda CONNECT (Safety, Security, Convenience) : -',
            'Security Alarm with Immobiliser : ✓'
          ]
        },

        'Variant 2': {
          'Engine & Perfomance': [
            '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
            '121 PS (119 hp) at 6,600 rpm, 145 Nm at 4,300 rpm',
            'Electronic Fuel Injection (PGM‑FI)',
            'Continuous Variable Transmission (CVT) with Econ mode',
            'Electric Power Steering (EPS)'
          ],
          'Perfomance': [
            '0-100 km/h in 10.7 seconds',
            'Maximum speed of 194 (km/h)',
            'Fuel consumption of 5.6 (L/100km)'
          ],
          'Brake System': [
            'Front : Ventilated Disc',
            'Rear : Solid Disc',
            'Parking Brake : Hand Brake Lever'
          ],
          'Suspension System': [
            'Front : MacPherson Strut',
            'Rear : Torsion Beam'
          ],
          'Dimension': [
            'Length (mm) 4,372',
            'Width (mm) 1,748',
            'Height (mm) 1,488',
            'Wheelbase (mm) 2,600',
            'Tread Front (mm) 1,495',
            'Tread Rear (mm) 1,485',
            'Curb Weight (kg) 1,152',
            'Fuel Tank Capacity (litre) 40',
            'Boot Capacity (Litre) 289'
          ],
          'Tyres': [
            'Wheel Type : Alloy',
            'Wheel Size : 16',
            'Tyre Size : 185/55R16',
            'Spare Tyre : Temporary repair kit (no spare tyre)'
          ],
          'Exterior': [
            'Headlights : Bi-LED',
            'Auto Headlights : ✓',
            'Daytime Running Lights : LED',
            'Side Mirrors with Turning Lights : ✓',
            'Auto Front Wiper : ✓',
            'Rear Wiper System : Intermittent',
            'Outer Door Handle : Black',
            'Rear Combi Lights : LED',
            'Antenna : Shark Fin'
          ],
          'Control & Interior': [
            'Remote Engine Start : ✓',
            'Walk Away Auto Lock : ✓',
            'Smart Entry with Push Start Button : ✓',
            'Paddle Shift : ✓',
            'Deceleration Selector Paddle : -',
            'ECON Button : ✓',
            'Meter Cluster : 7” TFT Meter',
            'Air Conditioning : Single Auto',
            'Rear Air Conditioning Ventilation : ✓',
            'Steering Wheel : Leather^',
            'Gear Knob Type : Leather^',
            'Upholstery : Leather^',
            'ULTRA Seat : ✓',
            'Steering Wheel Switch Audio Control : ✓',
            'Pedal Pad Type : Sport',
            'Power Adjustable Door Mirror : ✓',
            'Auto Retractable Door Mirror : ✓',
            'Center Console with Armrest : ✓',
            'Front Panel Ambient Light : ✓',
            'Door Pocket, Front Foot, Front Door Inner Handle Light : ✓',
            'Wireless Charger : -',
            'Rear USB Charger : 2'
          ],
          'Audio': [
            'Audio System : 10” Display Audio',
            'Apple CarPlay™ & Android Auto™ Connectivity* : Wireless',
            'USB Port : 2',
            'Hands-Free Telephone (HFT) : ✓',
            'Speakers : 4',
            'Bluetooth : ✓',
            'Tweeter : 4'
          ],
          'Safety & Security': [
            'Dual Front SRS Airbags : ✓',
            'Side Airbags : ✓',
            'Side Curtain Airbags : ✓',
            'Driver Seatbelt Reminder : ✓',
            'Assistant Seatbelt Reminder : ✓',
            'Rear Seatbelt Reminder : ✓',
            'ISOFIX I-Size Type : ✓',
            'Auto Door Lock : ✓',
            'Vehicle Stability Assist (VSA) : ✓',
            'Anti-lock Braking System (ABS) : ✓',
            'Electronic Brake Distribution (EBD) : ✓',
            'Auto Brake Hold (ABH) : -',
            'Hill Start Assist (HSA) : ✓',
            'Emergency Stop Signal (ESS) : ✓',
            'Reverse Sensors : 2',
            'Reverse Camera : ✓',
            'Multi-View Camera System (MVCS) : ✓',
            'Blind Spot Information with Cross Traffic Monitoring (BSI with CTM) : ✓',
            'Honda LaneWatch Camera (LWC) : ✓',
            'Forward Collision Warning (FCW) : ✓',
            'Collision Mitigation Braking System (CMBS) : ✓',
            'Lane Keep Assist System (LKAS) : ✓',
            'Lane Departure Warning (LDW) : ✓',
            'Road Departure Mitigation (RDM) : ✓',
            'Adaptive Cruise Control (ACC) : ✓',
            'Low Speed Follow (LSF) : -',
            'Auto High Beam (AHB) : ✓',
            'Lead Car Departure Notification (LCDN) : ✓',
            'Honda CONNECT (Safety, Security, Convenience) : ✓',
            'Security Alarm with Immobiliser : ✓'
          ]
        },

        'Variant 3': {
          'Engine & Perfomance': [
            '1.5 litre DOHC i-VTEC Atkinson-cycle four-cylinder engine (acts mainly as generator)',
            'Engine: 98 PS (72 kW) at 5,600 - 6,400 rpm, 127 Nm at 4,500 - 5,000 rpm',
            'Electric motor: 109 PS (80 kW) at 3,500 - 8,000 rpm, 253 Nm at 0 - 3,000 rpm',
            'Electronic Fuel Injection (PGM‑FI)',
            'Electric Continuous Variable Transmission (e‑CVT)',
            'Electric Power Steering (EPS)'
          ],
          'Perfomance': [
            '0-100 km/h in 9.4 seconds',
            'Maximum speed of 178 (km/h)',
            'Fuel consumption of 3.7 (L/100km)'
          ],
          'Brake System': [
            'Front : Ventilated Disc',
            'Rear : Solid Disc',
            'Parking Brake : Electric Parking Brake'
          ],
          'Suspension System': [
            'Front : MacPherson Strut',
            'Rear : Torsion Beam'
          ],
          'Dimension': [
            'Length (mm) 4,372',
            'Width (mm) 1,748',
            'Height (mm) 1,488',
            'Wheelbase (mm) 2,600',
            'Tread Front (mm) 1,495',
            'Tread Rear (mm) 1,485',
            'Curb Weight (kg) 1,254',
            'Fuel Tank Capacity (litre) 40',
            'Boot Capacity (Litre) 289'
          ],
          'Tyres': [
            'Wheel Type : Alloy',
            'Wheel Size : 16',
            'Tyre Size : 185/55R16',
            'Spare Tyre : Temporary repair kit (no spare tyre)'
          ],
          'Exterior': [
            'Headlights : Bi-LED',
            'Auto Headlights : ✓',
            'Daytime Running Lights : LED',
            'Side Mirrors with Turning Lights : ✓',
            'Auto Front Wiper : ✓',
            'Rear Wiper System : Intermittent',
            'Outer Door Handle : Black',
            'Rear Combi Lights : LED',
            'Antenna : Shark Fin'
          ],
          'Control & Interior': [
            'Remote Engine Start : ✓',
            'Walk Away Auto Lock : ✓',
            'Smart Entry with Push Start Button : ✓',
            'Paddle Shift : -',
            'Deceleration Selector Paddle : ✓',
            'ECON Button : ✓',
            'Meter Cluster : 7” TFT Meter',
            'Air Conditioning : Single Auto',
            'Rear Air Conditioning Ventilation : ✓',
            'Steering Wheel : Leather^',
            'Gear Knob Type : Leather^',
            'Upholstery : Leather^',
            'ULTRA Seat : ✓',
            'Steering Wheel Switch Audio Control : ✓',
            'Pedal Pad Type : Sport',
            'Power Adjustable Door Mirror : ✓',
            'Auto Retractable Door Mirror : ✓',
            'Center Console with Armrest : ✓',
            'Front Panel Ambient Light : ✓',
            'Door Pocket, Front Foot, Front Door Inner Handle Light : ✓',
            'Wireless Charger : ✓',
            'Rear USB Charger : 2'
          ],
          'Audio': [
            'Audio System : 10” Display Audio',
            'Apple CarPlay™ & Android Auto™ Connectivity* : Wireless',
            'USB Port : 2',
            'Hands-Free Telephone (HFT) : ✓',
            'Speakers : 4',
            'Bluetooth : ✓',
            'Tweeter : 4'
          ],
          'Safety & Security': [
            'Dual Front SRS Airbags : ✓',
            'Side Airbags : ✓',
            'Side Curtain Airbags : ✓',
            'Driver Seatbelt Reminder : ✓',
            'Assistant Seatbelt Reminder : ✓',
            'Rear Seatbelt Reminder : ✓',
            'ISOFIX I-Size Type : ✓',
            'Auto Door Lock : ✓',
            'Vehicle Stability Assist (VSA) : ✓',
            'Anti-lock Braking System (ABS) : ✓',
            'Electronic Brake Distribution (EBD) : ✓',
            'Auto Brake Hold (ABH) : ✓',
            'Hill Start Assist (HSA) : ✓',
            'Emergency Stop Signal (ESS) : ✓',
            'Reverse Sensors : 2',
            'Reverse Camera : ✓',
            'Multi-View Camera System (MVCS) : ✓',
            'Blind Spot Information with Cross Traffic Monitoring (BSI with CTM) : ✓',
            'Honda LaneWatch Camera (LWC) : ✓',
            'Forward Collision Warning (FCW) : ✓',
            'Collision Mitigation Braking System (CMBS) : ✓',
            'Lane Keep Assist System (LKAS) : ✓',
            'Lane Departure Warning (LDW) : ✓',
            'Road Departure Mitigation (RDM) : ✓',
            'Adaptive Cruise Control (ACC) : ✓',
            'Low Speed Follow (LSF) : ✓',
            'Auto High Beam (AHB) : ✓',
            'Lead Car Departure Notification (LCDN) : ✓',
            'Honda CONNECT (Safety, Security, Convenience) : ✓',
            'Security Alarm with Immobiliser : ✓'
          ]
        }
      },
  'Honda Civic'           : {
    'Variant 1': {
      'Engine & Perfomance': [
          '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
          '182 PS (180  hp) at 6,600 rpm, 240 Nm at 4,500 rpm',
          'Electronic Fuel Injection (PGM‑FI)',
          'Continuous Variable Transmission (CVT)',
          'Electric Power Steering (EPS)',
      ],
      'Perfomance' :[
        '0-100 km/h in 8.3 seconds',
        'Maximum speed of 200 (km/h)',
        'Fuel consumption of 6.0 (L/100km)'
      ],
      'Brake System': [
        'Front :	Ventilated Disc',
        'Rear :	Solid Disc',
        'Parking Brake :	Electric Parking Brake'
      ],
      'Suspension System':[
        'Front : MacPherson Strut',
        'Rear : Multi Link'
      ],
      'Dimension': [
        'Length (mm)	4,678',
        'Width (mm)	1,802',
        'Height (mm)	1,415',
        'Wheelbase (mm)	2,735',
        'Tread Front (mm)	1,547',
        'Tread Rear (mm)	1,575',
        'Curb Weight (kg)	1,338',
        'Fuel Tank Capacity (litre) 47',
        'Boot Capacity (Litre)	497'
      ],
      'Tyres' :[
        'Wheel Type : Alloy',
        'Wheel Size :	16',
        'Tyre Size	: 215/55R16',
        'Spare Tyre Size : 16'
      ],
      'Exterior' : [
        'Headlights	: LED',
          'Auto Headlights : ✓',	
          'Daytime Running Lights	: LED',
          'Front Fog Lights : -',
          'Side Mirrors With Turning Lights : ✓',	
          'Outer Door Handle : Body Colour',
          'Trunk Spoiler : - ',
          'Rear Combi Lights : LED',
          'Antenna	: Shark Fin',
          'Tailpipe Chrome Finisher : -'
      ],
      'Control & Interior' :[
        'Remote Engine Start : ✓',
        'Walk Away Auto Lock : ✓',
        'Smart Entry with Push Start Button : ✓',
        'Key Card : -',
        'Paddle Shift : -',
        'Deceleration Selector Paddle :	-',
        'ECON Button : ✓',
        'SPORT Button: - ',
        'Meter Cluster : 7” TFT Meter',
        'Air Conditioning	: Single Auto',
        'Rear Air Conditioning Ventilation : ✓',
        'Auto Dim Rearview Mirror : -',
        'Steering Wheel :	Leather^',
        'Gear Knob Type	: Leather^',
        'Upholstery	: Fabric',
        '8‑Way Driver Power Seat : -',
        '60:40 Seats : ✓',
        'Auto Front Wiper : -',
        'Smart Clear Wiper : ✓',
        'Steering Wheel Switch Audio Control : ✓',
        'Pedal Pad Type	: Normal',
        'Power Adjustable Door Mirror : ✓',
        'Power Retractable Door Mirror : ✓',
        'Centre Console with Armrest	: ✓',
        'Rear USB Charger : 2',
        'Front Roof Ambient Light : ✓',
        'Front Foot Light : -',
        'Front Door Ambient Light : -',
        'Active Noise Control With Active Sound Control : -',
        'Wireless Charger: -'
      ],
      'Audio':[
        'Audio System	Standard Audio : 8” Display Audio',
        'Apple CarPlay™ & Android Auto™ Connectivity* : ✓',
        'USB Port	: 1',
        'Hands‑Free Telephone (HFT) : ✓',
        'Speakers	: 4',
        'Bluetooth	: ✓',
      ],
      'Safety & Security':[
        'Dual Front SRS Airbags : ✓',
        'Side Airbags : ✓',
        'Side Curtain Airbags : ✓',
        'Front & Rear Seatbelt Reminder : ✓',
        'Rear Seat Reminder : ✓',
        'ISOFIX I‑Size Type : ✓',
        'Auto Door Lock : ✓',
        'Vehicle Stability Assist (VSA) : ✓',
        'Agile Handle Assist (AHA) : ✓',
        'Anti‑lock Braking System (ABS) : ✓',
        'Electronic Brake Distribution (EBD) : ✓',
        'Auto Brake Hold (ABH) : ✓',
        'Hill Start Assist (HSA) : ✓',
        'Emergency Stop Signal (ESS) : ✓',
        'Front Sensors : ✓',
        'Reverse Sensors : ✓',
        'Reverse Camera : Multi-angle',
        'Honda LaneWatch Camera (LWC) : -',
        'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, LSF, AHB, LCDN) : ✓',
        'Honda CONNECT (Safety, Security, Convenience) : -',
        'Driver Attention Monitor : ✓',
        'Security Alarm with Immobiliser : ✓',
      ]

    },
    'Variant 2': {
      'Engine & Perfomance': [
          '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
          '182 PS (180  hp) at 6,600 rpm, 240 Nm at 4,500 rpm',
          'Electronic Fuel Injection (PGM‑FI)',
          'Continuous Variable Transmission (CVT)',
          'Electric Power Steering (EPS)',
      ],
      'Perfomance' :[
        '0-100 km/h in 8.3 seconds',
        'Maximum speed of 200 (km/h)',
        'Fuel consumption of 6.0 (L/100km)'
      ],
      'Brake System': [
        'Front :	Ventilated Disc',
        'Rear :	Solid Disc',
        'Parking Brake :	Electric Parking Brake'
      ],
      'Suspension System':[
        'Front : MacPherson Strut',
        'Rear : Multi Link'
      ],
      'Dimension': [
        'Length (mm)	4,678',
        'Width (mm)	1,802',
        'Height (mm)	1,415',
        'Wheelbase (mm)	2,735',
        'Tread Front (mm)	1,547',
        'Tread Rear (mm)	1,575',
        'Curb Weight (kg)	1,338',
        'Fuel Tank Capacity (litre) 47',
        'Boot Capacity (Litre)	497'
      ],
      'Tyres' :[
        'Wheel Type : Alloy',
        'Wheel Size :	17',
        'Tyre Size	: 215/50R17',
        'Spare Tyre Size : 16'
      ],
      'Exterior' : [
        'Headlights	: LED',
          'Auto Headlights : ✓',	
          'Daytime Running Lights	: LED',
          'Front Fog Lights : LED',
          'Side Mirrors With Turning Lights : ✓',	
          'Outer Door Handle : Half Chrome',
          'Trunk Spoiler : - ',
          'Rear Combi Lights : LED',
          'Antenna	: Shark Fin',
          'Tailpipe Chrome Finisher : -'
      ],
      'Control & Interior' :[
        'Remote Engine Start : ✓',
        'Walk Away Auto Lock : ✓',
        'Smart Entry with Push Start Button : ✓',
        'Key Card : -',
        'Paddle Shift : ✓',
        'Deceleration Selector Paddle :	-',
        'ECON Button : ✓',
        'SPORT Button: ✓ ',
        'Meter Cluster : 7” TFT Meter',
        'Air Conditioning	: Single Auto',
        'Rear Air Conditioning Ventilation : ✓',
        'Auto Dim Rearview Mirror : ✓',
        'Steering Wheel :	Leather^',
        'Gear Knob Type	: Leather^',
        'Upholstery	: Leather^',
        '8‑Way Driver Power Seat : ✓',
        '60:40 Seats : ✓',
        'Auto Front Wiper : -',
        'Smart Clear Wiper : ✓',
        'Steering Wheel Switch Audio Control : ✓',
        'Pedal Pad Type	: Normal',
        'Power Adjustable Door Mirror : ✓',
        'Power Retractable Door Mirror : ✓',
        'Centre Console with Armrest	: ✓',
        'Rear USB Charger : 2',
        'Front Roof Ambient Light : ✓',
        'Front Foot Light : -',
        'Front Door Ambient Light : -',
        'Active Noise Control With Active Sound Control : -',
        'Wireless Charger: -'
      ],
      'Audio':[
        'Audio System	Standard Audio :9" Advanced Display Audio',
        'Apple CarPlay™ & Android Auto™ Connectivity* : ✓ with Wireless Apple CarPlay',
        'USB Port	: 2',
        'Hands‑Free Telephone (HFT) : ✓',
        'Speakers	: 8',
        'Bluetooth	: ✓',
      ],
      'Safety & Security':[
        'Dual Front SRS Airbags : ✓',
        'Side Airbags : ✓',
        'Side Curtain Airbags : ✓',
        'Front & Rear Seatbelt Reminder : ✓',
        'Rear Seat Reminder : ✓',
        'ISOFIX I‑Size Type : ✓',
        'Auto Door Lock : ✓',
        'Vehicle Stability Assist (VSA) : ✓',
        'Agile Handle Assist (AHA) : ✓',
        'Anti‑lock Braking System (ABS) : ✓',
        'Electronic Brake Distribution (EBD) : ✓',
        'Auto Brake Hold (ABH) : ✓',
        'Hill Start Assist (HSA) : ✓',
        'Emergency Stop Signal (ESS) : ✓',
        'Front Sensors : ✓',
        'Reverse Sensors : ✓',
        'Reverse Camera : Multi-angle',
        'Honda LaneWatch Camera (LWC) : ✓',
        'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, LSF, AHB, LCDN) : ✓',
        'Honda CONNECT (Safety, Security, Convenience) : ✓',
        'Driver Attention Monitor : ✓',
        'Security Alarm with Immobiliser : ✓',
      ]

    },
    'Variant 3': {
      'Engine & Perfomance': [
          '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
          '182 PS (180  hp) at 6,600 rpm, 240 Nm at 4,500 rpm',
          'Electronic Fuel Injection (PGM‑FI)',
          'Continuous Variable Transmission (CVT)',
          'Electric Power Steering (EPS)',
      ],
      'Perfomance' :[
        '0-100 km/h in 8.3 seconds',
        'Maximum speed of 200 (km/h)',
        'Fuel consumption of 6.0 (L/100km)'
      ],
      'Brake System': [
        'Front :	Ventilated Disc',
        'Rear :	Solid Disc',
        'Parking Brake :	Electric Parking Brake'
      ],
      'Suspension System':[
        'Front : MacPherson Strut',
        'Rear : Multi Link'
      ],
      'Dimension': [
        'Length (mm)	4,678',
        'Width (mm)	1,802',
        'Height (mm)	1,415',
        'Wheelbase (mm)	2,735',
        'Tread Front (mm)	1,547',
        'Tread Rear (mm)	1,575',
        'Curb Weight (kg)	1,338',
        'Fuel Tank Capacity (litre) 47',
        'Boot Capacity (Litre)	497'
      ],
      'Tyres' :[
        'Wheel Type : Alloy',
        'Wheel Size :	18',
        'Tyre Size	: 235/540ZR18',
        'Spare Tyre Size : 16'
      ],
      'Exterior' : [
        'Headlights	: LED',
          'Auto Headlights : ✓',	
          'Daytime Running Lights	: LED',
          'Front Fog Lights : LED',
          'Side Mirrors With Turning Lights : ✓',	
          'Outer Door Handle : Half Chrome',
          'Trunk Spoiler : ✓',
          'Rear Combi Lights : LED',
          'Antenna	: Shark Fin Black',
          'Tailpipe Chrome Finisher : ✓'
      ],
      'Control & Interior' :[
        'Remote Engine Start : ✓',
        'Walk Away Auto Lock : ✓',
        'Smart Entry with Push Start Button : ✓',
        'Key Card : -',
        'Paddle Shift : ✓',
        'Deceleration Selector Paddle :	-',
        'ECON Button : ✓',
        'SPORT Button: ✓ ',
        'Meter Cluster : 7” TFT Meter',
        'Air Conditioning	: Single Auto',
        'Rear Air Conditioning Ventilation : ✓',
        'Auto Dim Rearview Mirror : ✓',
        'Steering Wheel :	Leather^',
        'Gear Knob Type	: Leather^',
        'Upholstery	: Half Leather^',
        '8‑Way Driver Power Seat : ✓',
        '60:40 Seats : ✓',
        'Auto Front Wiper : ✓',
        'Smart Clear Wiper : ✓',
        'Steering Wheel Switch Audio Control : ✓',
        'Pedal Pad Type	: Sport',
        'Power Adjustable Door Mirror : ✓',
        'Power Retractable Door Mirror : ✓',
        'Centre Console with Armrest	: ✓',
        'Rear USB Charger : 2',
        'Front Roof Ambient Light : ✓',
        'Front Foot Light : ✓',
        'Front Door Ambient Light : ✓',
        'Active Noise Control With Active Sound Control : -',
        'Wireless Charger: -'
      ],
      'Audio':[
        'Audio System	Standard Audio :9" Advanced Display Audio',
        'Apple CarPlay™ & Android Auto™ Connectivity* : ✓ with Wireless Apple CarPlay',
        'USB Port	: 2',
        'Hands‑Free Telephone (HFT) : ✓',
        'Speakers	: 8',
        'Bluetooth	: ✓',
      ],
      'Safety & Security':[
        'Dual Front SRS Airbags : ✓',
        'Side Airbags : ✓',
        'Side Curtain Airbags : ✓',
        'Front & Rear Seatbelt Reminder : ✓',
        'Rear Seat Reminder : ✓',
        'ISOFIX I‑Size Type : ✓',
        'Auto Door Lock : ✓',
        'Vehicle Stability Assist (VSA) : ✓',
        'Agile Handle Assist (AHA) : ✓',
        'Anti‑lock Braking System (ABS) : ✓',
        'Electronic Brake Distribution (EBD) : ✓',
        'Auto Brake Hold (ABH) : ✓',
        'Hill Start Assist (HSA) : ✓',
        'Emergency Stop Signal (ESS) : ✓',
        'Front Sensors : ✓',
        'Reverse Sensors : ✓',
        'Reverse Camera : Multi-angle',
        'Honda LaneWatch Camera (LWC) : ✓',
        'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, LSF, AHB, LCDN) : ✓',
        'Honda CONNECT (Safety, Security, Convenience) : ✓',
        'Driver Attention Monitor : ✓',
        'Security Alarm with Immobiliser : ✓',
      ]

    },
    'Variant 4': {
      'Engine & Perfomance': [
          '2.0 litre DOHC (Atkinson Cycle) naturally-aspirated four-cylinder engine',
          '182 PS (180  hp) at 6,600 rpm, 240 Nm at 4,500 rpm',
          'Direct Fuel Injection ',
          'Electric Continuous Variable Transmission (e‑CVT)',
          'Electric Power Steering (EPS)',
      ],
      'Perfomance' :[
        '0-100 km/h in 7.9 seconds',
        'Maximum speed of 180 (km/h)',
        'Fuel consumption of 4.0 (L/100km)'
      ],
      'Brake System': [
        'Front :	Ventilated Disc',
        'Rear :	Solid Disc',
        'Parking Brake :	Electric Parking Brake'
      ],
      'Suspension System':[
        'Front : MacPherson Strut',
        'Rear : Multi Link'
      ],
      'Dimension': [
        'Length (mm)	4,678',
        'Width (mm)	1,802',
        'Height (mm)	1,415',
        'Wheelbase (mm)	2,735',
        'Tread Front (mm)	1,547',
        'Tread Rear (mm)	1,575',
        'Curb Weight (kg)	1,445',
        'Fuel Tank Capacity (litre) 47',
        'Boot Capacity (Litre)	497'
      ],
      'Tyres' :[
        'Wheel Type : Alloy',
        'Wheel Size :	18',
        'Tyre Size	: 235/540ZR18',
        'Spare Tyre Size : 16'
      ],
      'Exterior' : [
        'Headlights	: LED',
          'Auto Headlights : ✓',	
          'Daytime Running Lights	: LED',
          'Front Fog Lights : LED',
          'Side Mirrors With Turning Lights : ✓',	
          'Outer Door Handle : Black Half Chrome',
          'Trunk Spoiler : ✓',
          'Rear Combi Lights : LED',
          'Antenna	: Shark Fin Black',
          'Tailpipe Chrome Finisher : ✓'
      ],
      'Control & Interior' :[
        'Remote Engine Start : ✓',
        'Walk Away Auto Lock : ✓',
        'Smart Entry with Push Start Button : ✓',
        'Key Card : ✓',
        'Paddle Shift : -',
        'Deceleration Selector Paddle :	✓',
        'ECON Button : ✓',
        'SPORT Button: ✓ ',
        'Meter Cluster : 10.2” TFT Meter',
        'Air Conditioning	: Dual Auto',
        'Rear Air Conditioning Ventilation : ✓',
        'Auto Dim Rearview Mirror : ✓',
        'Steering Wheel :	Leather^',
        'Gear Knob Type	: Leather^',
        'Upholstery	: Half Leather^',
        '8‑Way Driver Power Seat : ✓',
        '60:40 Seats : ✓',
        'Auto Front Wiper : ✓',
        'Smart Clear Wiper : ✓',
        'Steering Wheel Switch Audio Control : ✓',
        'Pedal Pad Type	: Sport',
        'Power Adjustable Door Mirror : ✓',
        'Power Retractable Door Mirror : ✓',
        'Centre Console with Armrest	: ✓',
        'Rear USB Charger : 2',
        'Front Roof Ambient Light : ✓',
        'Front Foot Light : ✓',
        'Front Door Ambient Light : ✓',
        'Active Noise Control With Active Sound Control : ✓',
        'Wireless Charger: ✓'
      ],
      'Audio':[
        'Audio System	Standard Audio :9" Advanced Display Audio',
        'Apple CarPlay™ & Android Auto™ Connectivity* : ✓ with Wireless Apple CarPlay',
        'USB Port	: 2',
        'Hands‑Free Telephone (HFT) : ✓',
        'Speakers	: 8',
        'Bluetooth	: ✓',
      ],
      'Safety & Security':[
        'Dual Front SRS Airbags : ✓',
        'Side Airbags : ✓',
        'Side Curtain Airbags : ✓',
        'Front & Rear Seatbelt Reminder : ✓',
        'Rear Seat Reminder : ✓',
        'ISOFIX I‑Size Type : ✓',
        'Auto Door Lock : ✓',
        'Vehicle Stability Assist (VSA) : ✓',
        'Agile Handle Assist (AHA) : ✓',
        'Anti‑lock Braking System (ABS) : ✓',
        'Electronic Brake Distribution (EBD) : ✓',
        'Auto Brake Hold (ABH) : ✓',
        'Hill Start Assist (HSA) : ✓',
        'Emergency Stop Signal (ESS) : ✓',
        'Front Sensors : ✓',
        'Reverse Sensors : ✓',
        'Reverse Camera : Multi-angle',
        'Honda LaneWatch Camera (LWC) : ✓',
        'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, LSF, AHB, LCDN) : ✓',
        'Honda CONNECT (Safety, Security, Convenience) : ✓',
        'Driver Attention Monitor : ✓',
        'Security Alarm with Immobiliser : ✓',
      ]

    },
    // Add more variants here
  },
  'Honda HRV'             : {
    'Variant 1': {
      'Engine & Perfomance': [
          '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
          '121 PS (119  hp) at 6,600 rpm, 145 Nm at 4,300 rpm',
          'Electronic Fuel Injection (PGM‑FI)',
          'Continuous Variable Transmission (CVT)',
          'Electric Power Steering (EPS)',
      ],
      'Perfomance' :[
        '0-100 km/h in 12.1 seconds',
        'Maximum speed of 187 (km/h)',
        'Fuel consumption of 5.9 (L/100km)'
      ],
      'Brake System': [
        'Front :	Ventilated Disc',
        'Rear :	Solid Disc',
        'Parking Brake :	Electric Parking Brake'
      ],
      'Suspension System':[
        'Front : MacPherson Strut',
        'Rear : Multi Link',
        'Variable Gear Ratio (VGR): -'
      ],
      'Dimension': [
        'Length (mm)	4,330',
        'Width (mm)	1,790',
        'Height (mm)	1,590',
        'Wheelbase (mm)	2,610',
        'Tread Front (mm)	1,545',
        'Tread Rear (mm)	1,550',
        'Curb Weight (kg)	1,273',
        'Fuel Tank Capacity (litre) 50',
        'Boot Capacity (Litre)	196'
      ],
      'Tyres' :[
        'Wheel Type : Aluminium-Alloy',
        'Wheel Size :	17',
        'Tyre Size	: 215/60R17',
        'Spare Tyre Size : 17'
      ],
      'Exterior' : [
        'Headlights	: LED',
          'Auto Headlights : ✓',	
          'Daytime Running Lights	: LED',
          'Front Fog Lights : -',
          'Front LED Sequential Turn Signals -',
          'Side Mirrors With Turning Lights : ✓',	
          'Outer Door Handle : Body Colour',
          'Rear Combi Lights : Red & Clear Lens (LED)',
          'Antenna	: Shark Fin',
          'Hands‑Free Power Tailgate With Walkaway Close : -',
          'Tailpipe Chrome Finisher : -'
      ],
      'Control & Interior' :[
        'Remote Engine Start : -',
        'Walk Away Auto Lock : ✓',
        'Smart Entry with Push Start Button : ✓',
        'Paddle Shift : -',
        'Deceleration Selector Paddle :	-',
        'Cruise Control : ✓',
        'ECON Button : ✓',
        'SPORT Button: - ',
        'Meter Cluster : 4.2” TFT Meter',
        'Air Conditioning	: Single Auto',
        'Rear Air Conditioning Ventilation : ✓',
        'Auto Dim Rearview Mirror : -',
        'Steering Wheel :	Urethane',
        'Upholstery	: Fabric',
        'Multi Utility Seat : ✓',
        '8‑Way Driver Power Seat : -',
        'Auto Front Wiper : -',
        'Rear Wiper System: ✓',
        'Steering Wheel Switch Audio Control : ✓',
        'Pedal Pad Type	: Normal',
        'Power Adjustable Door Mirror : ✓',
        'Power Retractable Door Mirror : ✓',
        'Centre Console with Armrest	: ✓',
        'Rear USB Charger : -',
        'Front Roof Ambient Light : LED',
      ],
      'Audio':[
        'Audio System	Standard Audio : 8” Display Audio',
        'Apple CarPlay™ & Android Auto™ Connectivity* : ✓',
        'USB Port	: 2',
        'Hands‑Free Telephone (HFT) : ✓',
        'Speakers	: 4',
        'Bluetooth	: ✓',
        'Tweeter : -',
      ],
      'Safety & Security':[
        'Dual Front SRS Airbags : ✓',
        'Side Airbags : ✓',
        'Side Curtain Airbags : ✓',
        'Front & Rear Seatbelt Reminder : ✓',
        'Rear Seat Reminder : ✓',
        'ISOFIX I‑Size Type : ✓',
        'Auto Door Lock : ✓',
        'Vehicle Stability Assist (VSA) : ✓',
        'Agile Handle Assist (AHA) : ✓',
        'Anti‑lock Braking System (ABS) : ✓',
        'Electronic Brake Distribution (EBD) : ✓',
        'Automatic Brake Hold (ABH) : ✓',
        'Hill Start Assist (HSA) : ✓',
        'Emergency Stop Signal (ESS) : ✓',
        'Reverse Sensors : 4',
        'Reverse Camera : Multi-angle',
        'Honda LaneWatch Camera (LWC) : -',
        'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, LSF, AHB, LCDN) : ✓',
        'Honda CONNECT (Safety, Security, Convenience) : -',
        'Hill Descent Control (HDC) : ✓',
        'Security Alarm with Immobiliser : ✓',
      ]

    },
    'Variant 2': {
      'Engine & Perfomance': [
          '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
          '181 PS (179  hp) at 6,600 rpm, 240 Nm at 4,300 rpm',
          'Electronic Fuel Injection (PGM‑FI)',
          'Continuous Variable Transmission (CVT)',
          'Electric Power Steering (EPS)',
      ],
      'Perfomance' :[
        '0-100 km/h in 8.7 seconds',
        'Maximum speed of 200 (km/h)',
        'Fuel consumption of 6.5 (L/100km)'
      ],
      'Brake System': [
        'Front :	Ventilated Disc',
        'Rear :	Solid Disc',
        'Parking Brake :	Electric Parking Brake'
      ],
      'Suspension System':[
        'Front : MacPherson Strut',
        'Rear : Multi Link',
        'Variable Gear Ratio (VGR): -'
      ],
      'Dimension': [
        'Length (mm)	4,385',
        'Width (mm)	1,790',
        'Height (mm)	1,590',
        'Wheelbase (mm)	2,610',
        'Tread Front (mm)	1,545',
        'Tread Rear (mm)	1,550',
        'Curb Weight (kg)	1,380',
        'Fuel Tank Capacity (litre) 50',
        'Boot Capacity (Litre)	183'
      ],
      'Tyres' :[
        'Wheel Type : Aluminium-Alloy',
        'Wheel Size :	17',
        'Tyre Size	: 215/60R17',
        'Spare Tyre Size : 17'
      ],
      'Exterior' : [
        'Headlights	: LED',
          'Auto Headlights : ✓',	
          'Daytime Running Lights	: LED',
          'Front Fog Lights : LED',
          'Front LED Sequential Turn Signals -',
          'Side Mirrors With Turning Lights : ✓',	
          'Outer Door Handle : Body Colour',
          'Rear Combi Lights : Red & Clear Lens (LED)',
          'Antenna	: Shark Fin',
          'Hands‑Free Power Tailgate With Walkaway Close : -',
          'Tailpipe Chrome Finisher : ✓'
      ],
      'Control & Interior' :[
        'Remote Engine Start : ✓',
        'Walk Away Auto Lock : ✓',
        'Smart Entry with Push Start Button : ✓',
        'Paddle Shift : ✓',
        'Deceleration Selector Paddle :	-',
        'Cruise Control : ✓',
        'ECON Button : ✓',
        'SPORT Button: ✓ ',
        'Meter Cluster : 7” TFT Meter',
        'Air Conditioning	: Single Auto',
        'Rear Air Conditioning Ventilation : ✓',
        'Auto Dim Rearview Mirror : -',
        'Steering Wheel :	Urethane',
        'Upholstery	: Fabric',
        'Multi Utility Seat : ✓',
        '8‑Way Driver Power Seat : -',
        'Auto Front Wiper : -',
        'Rear Wiper System: ✓',
        'Steering Wheel Switch Audio Control : ✓',
        'Pedal Pad Type	: Normal',
        'Power Adjustable Door Mirror : ✓',
        'Power Retractable Door Mirror : ✓',
        'Centre Console with Armrest	: ✓',
        'Rear USB Charger : 2',
        'Front Roof Ambient Light : LED',
      ],
      'Audio':[
        'Audio System	Standard Audio : 8” Display Audio',
        'Apple CarPlay™ & Android Auto™ Connectivity* : ✓',
        'USB Port	: 2',
        'Hands‑Free Telephone (HFT) : ✓',
        'Speakers	: 4',
        'Bluetooth	: ✓',
        'Tweeter : -',
      ],
      'Safety & Security':[
        'Dual Front SRS Airbags : ✓',
        'Side Airbags : ✓',
        'Side Curtain Airbags : ✓',
        'Front & Rear Seatbelt Reminder : ✓',
        'Rear Seat Reminder : ✓',
        'ISOFIX I‑Size Type : ✓',
        'Auto Door Lock : ✓',
        'Vehicle Stability Assist (VSA) : ✓',
        'Agile Handle Assist (AHA) : ✓',
        'Anti‑lock Braking System (ABS) : ✓',
        'Electronic Brake Distribution (EBD) : ✓',
        'Automatic Brake Hold (ABH) : ✓',
        'Hill Start Assist (HSA) : ✓',
        'Emergency Stop Signal (ESS) : ✓',
        'Reverse Sensors : 4',
        'Reverse Camera : Multi-angle',
        'Honda LaneWatch Camera (LWC) : -',
        'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, LSF, AHB, LCDN) : ✓',
        'Honda CONNECT (Safety, Security, Convenience) : -',
        'Hill Descent Control (HDC) : ✓',
        'Security Alarm with Immobiliser : ✓',
      ]

    },
    'Variant 3': {
      'Engine & Perfomance': [
          '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
          '181 PS (179  hp) at 6,600 rpm, 240 Nm at 4,300 rpm',
          'Electronic Fuel Injection (PGM‑FI)',
          'Continuous Variable Transmission (CVT)',
          'Electric Power Steering (EPS)',
      ],
      'Perfomance' :[
        '0-100 km/h in 8.8 seconds',
        'Maximum speed of 200 (km/h)',
        'Fuel consumption of 6.5 (L/100km)'
      ],
      'Brake System': [
        'Front :	Ventilated Disc',
        'Rear :	Solid Disc',
        'Parking Brake :	Electric Parking Brake'
      ],
      'Suspension System':[
        'Front : MacPherson Strut',
        'Rear : Multi Link',
        'Variable Gear Ratio (VGR): ✓'
      ],
      'Dimension': [
        'Length (mm)	4,385',
        'Width (mm)	1,790',
        'Height (mm)	1,590',
        'Wheelbase (mm)	2,610',
        'Tread Front (mm)	1,545',
        'Tread Rear (mm)	1,540',
        'Curb Weight (kg)	1,403',
        'Fuel Tank Capacity (litre) 50',
        'Boot Capacity (Litre)	183'
      ],
      'Tyres' :[
        'Wheel Type : Aluminium-Alloy',
        'Wheel Size :	18',
        'Tyre Size	: 225/50R18',
        'Spare Tyre Size : 18'
      ],
      'Exterior' : [
        'Headlights	: LED',
          'Auto Headlights : ✓',	
          'Daytime Running Lights	: LED',
          'Front Fog Lights : LED',
          'Front LED Sequential Turn Signals: ✓',
          'Side Mirrors With Turning Lights : ✓',	
          'Outer Door Handle : Body Colour',
          'Rear Combi Lights : Red & Clear Lens (LED)',
          'Antenna	: Shark Fin',
          'Hands‑Free Power Tailgate With Walkaway Close : -',
          'Tailpipe Chrome Finisher : ✓'
      ],
      'Control & Interior' :[
        'Remote Engine Start : ✓',
        'Walk Away Auto Lock : ✓',
        'Smart Entry with Push Start Button : ✓',
        'Paddle Shift : ✓',
        'Deceleration Selector Paddle :	-',
        'Cruise Control : ✓',
        'ECON Button : ✓',
        'SPORT Button: ✓ ',
        'Meter Cluster : 7” TFT Meter',
        'Air Conditioning	: Single Auto',
        'Rear Air Conditioning Ventilation : ✓',
        'Auto Dim Rearview Mirror : -',
        'Steering Wheel :	Leather^',
        'Upholstery	: Leather^',
        'Multi Utility Seat : ✓',
        '8‑Way Driver Power Seat : ✓',
        'Auto Front Wiper : -',
        'Rear Wiper System: ✓',
        'Steering Wheel Switch Audio Control : ✓',
        'Pedal Pad Type	: Normal',
        'Power Adjustable Door Mirror : ✓',
        'Power Retractable Door Mirror : ✓',
        'Centre Console with Armrest	: ✓',
        'Rear USB Charger : 2',
        'Front Roof Ambient Light : LED',
      ],
      'Audio':[
        'Audio System	Standard Audio : 8” Display Audio',
        'Apple CarPlay™ & Android Auto™ Connectivity* : ✓',
        'USB Port	: 2',
        'Hands‑Free Telephone (HFT) : ✓',
        'Speakers	: 4',
        'Bluetooth	: ✓',
        'Tweeter : 4'
      ],
      'Safety & Security':[
        'Dual Front SRS Airbags : ✓',
        'Side Airbags : ✓',
        'Side Curtain Airbags : ✓',
        'Front & Rear Seatbelt Reminder : ✓',
        'Rear Seat Reminder : ✓',
        'ISOFIX I‑Size Type : ✓',
        'Auto Door Lock : ✓',
        'Vehicle Stability Assist (VSA) : ✓',
        'Agile Handle Assist (AHA) : ✓',
        'Anti‑lock Braking System (ABS) : ✓',
        'Electronic Brake Distribution (EBD) : ✓',
        'Automatic Brake Hold (ABH) : ✓',
        'Hill Start Assist (HSA) : ✓',
        'Emergency Stop Signal (ESS) : ✓',
        'Reverse Sensors : 4',
        'Reverse Camera : Multi-angle',
        'Honda LaneWatch Camera (LWC) : ✓',
        'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, LSF, AHB, LCDN) : ✓',
        'Honda CONNECT (Safety, Security, Convenience) : ✓',
        'Hill Descent Control (HDC) : ✓',
        'Security Alarm with Immobiliser : ✓',
      ]

    },
    'Variant 4': {
      'Engine & Perfomance': [
          '1.5 litre DOHC i-VTEC (Atkinson Cycle) four-cylinder engine',
          '131 PS (131  hp) at 6,600 rpm, 253 Nm at 4,300 rpm',
          'Electronic Fuel Injection (PGM‑FI)',
          'Electric Continuous Variable Transmission (e‑CVT)',
          'Electric Power Steering (EPS)',
      ],
      'Perfomance' :[
        '0-100 km/h in 10.7 seconds',
        'Maximum speed of 170 (km/h)',
        'Fuel consumption of 4.1 (L/100km)'
      ],
      'Brake System': [
        'Front :	Ventilated Disc',
        'Rear :	Solid Disc',
        'Parking Brake :	Electric Parking Brake'
      ],
      'Suspension System':[
        'Front : MacPherson Strut',
        'Rear : Multi Link',
        'Variable Gear Ratio (VGR): ✓'
      ],
      'Dimension': [
        'Length (mm)	4,385',
        'Width (mm)	1,790',
        'Height (mm)	1,590',
        'Wheelbase (mm)	2,610',
        'Tread Front (mm)	1,545',
        'Tread Rear (mm)	1,540',
        'Curb Weight (kg)	1,403',
        'Fuel Tank Capacity (litre) 50',
        'Boot Capacity (Litre)	196'
      ],
      'Tyres' :[
        'Wheel Type : Aluminium-Alloy',
        'Wheel Size :	18',
        'Tyre Size	: 225/50R18',
        'Spare Tyre Size : Temporary Repair Kit'
      ],
      'Exterior' : [
        'Headlights	: LED',
          'Auto Headlights : ✓',	
          'Daytime Running Lights	: LED',
          'Front Fog Lights : LED',
          'Front LED Sequential Turn Signals: ✓',
          'Side Mirrors With Turning Lights : ✓',	
          'Outer Door Handle : Body Colour',
          'Rear Combi Lights : Smoked & Clear Lens (LED)',
          'Antenna	: Shark Fin',
          'Hands‑Free Power Tailgate With Walkaway Close : ✓',
          'Tailpipe Chrome Finisher : -'
      ],
      'Control & Interior' :[
        'Remote Engine Start : ✓',
        'Walk Away Auto Lock : ✓',
        'Smart Entry with Push Start Button : ✓',
        'Paddle Shift : -',
        'Deceleration Selector Paddle :	✓',
        'Cruise Control : ✓',
        'ECON Button : ✓',
        'SPORT Button: ✓ ',
        'Meter Cluster : 7” TFT Meter',
        'Air Conditioning	: Dual Auto',
        'Rear Air Conditioning Ventilation : ✓',
        'Auto Dim Rearview Mirror : -',
        'Steering Wheel :	Leather^',
        'Upholstery	: Leather^',
        'Multi Utility Seat : ✓',
        '8‑Way Driver Power Seat : ✓',
        'Auto Front Wiper : ✓',
        'Rear Wiper System: ✓',
        'Steering Wheel Switch Audio Control : ✓',
        'Pedal Pad Type	: Sport',
        'Power Adjustable Door Mirror : ✓',
        'Power Retractable Door Mirror : ✓',
        'Centre Console with Armrest	: ✓',
        'Rear USB Charger : 2',
        'Front Roof Ambient Light : LED',
      ],
      'Audio':[
        'Audio System	Standard Audio : 8” Display Audio',
        'Apple CarPlay™ & Android Auto™ Connectivity* : ✓',
        'USB Port	: 2',
        'Hands‑Free Telephone (HFT) : ✓',
        'Speakers	: 4',
        'Bluetooth	: ✓',
        'Tweeter : 4'
      ],
      'Safety & Security':[
        'Dual Front SRS Airbags : ✓',
        'Side Airbags : ✓',
        'Side Curtain Airbags : ✓',
        'Front & Rear Seatbelt Reminder : ✓',
        'Rear Seat Reminder : ✓',
        'ISOFIX I‑Size Type : ✓',
        'Auto Door Lock : ✓',
        'Vehicle Stability Assist (VSA) : ✓',
        'Agile Handle Assist (AHA) : ✓',
        'Anti‑lock Braking System (ABS) : ✓',
        'Electronic Brake Distribution (EBD) : ✓',
        'Automatic Brake Hold (ABH) : ✓',
        'Hill Start Assist (HSA) : ✓',
        'Emergency Stop Signal (ESS) : ✓',
        'Reverse Sensors : 4',
        'Reverse Camera : Multi-angle',
        'Honda LaneWatch Camera (LWC) : ✓',
        'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, LSF, AHB, LCDN) : ✓',
        'Honda CONNECT (Safety, Security, Convenience) : ✓',
        'Hill Descent Control (HDC) : ✓',
        'Security Alarm with Immobiliser : ✓',
      ]

    },

  },
  'Honda WRV'             : {
    // DG4 facelift, launched 1 September 2026. Base S variant discontinued;
    // range is now E / V / RS. Shared updates: 17" alloys, 10" Display Audio.
    'Variant 1': {
        'Engine': [
            '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
            '1,498 Displacement (CC)',
            'Max Torque : 145 Nm,  14.8 kg-m and 4300 rpm',
            'Max Power : 121 PS , 89 kW and 6600 rpm',
            'Electronic Fuel Injection (PGM-FI)',
            'Continuous Variable Transmission (CVT)',
            'Electric Power Steering (EPS)'
        ],
        'Perfomance': [
            '160 km/h Maximum speed',
            '11s of Accelaration of 0-100 km/h (secs)',
            'Fuel Consumption (L/100km) : 6.0'
        ],
        'Brake System': [
          'Front :	Ventilated Disc',
          'Rear :	Drum',
          'Parking Brake :	Hand Brake Lever'
        ],
        'Suspension System':[
          'Front : MacPherson Strut',
          'Rear : Torsion Beam'
        ],
        'Dimension': [
          'Length (mm)	4,060',
          'Width (mm)	1,780',
          'Height (mm)	1,608',
          'Wheelbase (mm)	2,485',
          'Tread Front (mm)	1,540',
          'Tread Rear (mm)	1,540',
          'Curb Weight (kg)	1,111',
          'Ground Clearance (mm) 207',
          'Fuel Tank Capacity (litre) 40',
          'Boot Capacity (Litre)	380'
        ],
        'Tyres' :[
          'Wheel Type : Alloy (Black)',
          'Wheel Size :	17',
          'Tyre Size	: 215/55/R17',
          'Spare Tyre Size : 17'
        ],
        'Exterior' : [
           'Headlights	: Halogen',
            'Auto Headlights : ✓',
            'Daytime Running Lights	: -',
            'Front Fog Lights : -',
            'Front LED Sequential Turn Signals : Bulb',
            'Side Mirrors With Turning Lights : ✓',
            'Outer Door Handle : Body Colour',
            'Rear Combi Lights : LED',
            'Antenna	: Shark Fin'
        ],
        'Control & Interior' :[
          'Remote Engine Start : ✓',
          'Walk Away Auto Lock : ✓',
          'Smart Entry with Push Start Button : ✓',
          'Paddle Shift : -',
          'Cruise Control : ✓',
          'Meter Cluster : 4.2" TFT Meter',
          'Air Conditioning	: Manual',
          'Air Conditioning Control	: Switch',
          'Steering Wheel :	Urethane',
          'Gear Knob Type	: Urethane',
          'Upholstery	: Fabric',
          'Wireless Charger : -',
          'Ambient Lighting : -',
          'Rear Wiper System : ✓',
          'Steering Wheel Switch Audio Control : ✓',
          'Pedal Pad Type	: Normal',
          'Power Adjustable Door Mirror : ✓',
          'Power Retractable Door Mirror : ✓',
          'Centre Console with Armrest	: Fabric',
          'Rear Accessory Socket : 1'
        ],
        'Audio':[
          'Audio System	Standard Audio : 10” Display Audio',
          'Apple CarPlay™ & Android Auto™ Connectivity* : ✓ Wireless',
          'USB Port	: 2',
          'Hands‑Free Telephone (HFT) : ✓',
          'Speakers	: 4',
          'Bluetooth	: ✓'
        ],
        'Safety & Security':[
          'Dual Front SRS Airbags: ✓',
          'Side Airbags: ✓',
          'Side Curtain Airbags: -',
          'Total Airbags: 4',
          'Driver Seatbelt Reminder: ✓',
          'Assistant Seatbelt Reminder: ✓',
          'Rear Seat Reminder: ✓',
          'ISOFIX I‑Size Type: ✓',
          'Auto Door Lock: ✓',
          'Vehicle Stability Assist (VSA): ✓',
          'Anti‑Lock Braking System (ABS): ✓',
          'Electronic Brake Distribution (EBD): ✓',
          'Hill Start Assist (HSA): ✓',
          'Emergency Stop Signal (ESS): ✓',
          'Reverse Sensors: 2',
          'Reverse Camera: Multi-Angle',
          '360-Degree Camera: -',
          'Honda LaneWatch Camera (LWC): ✓',
          'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, AHB, LCDN): ✓',
          'Forward Collision Warning (FCW): ✓',
          'Collision Mitigation Braking System (CMBS): ✓',
          'Lane Keep Assist System (LKAS): ✓',
          'Lane Departure Warning (LDW): ✓',
          'Road Departure Mitigation (RDM): ✓',
          'Adaptive Cruise Control (ACC): ✓',
          'Auto High Beam: ✓',
          'Lead Car Departure Notification: ✓',
          'Honda CONNECT (Safety, Security, Convenience): -',
          'Security Alarm with Immobiliser: ✓'
        ]
    },
    'Variant 2': {
        'Engine': [
            '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
            '1,498 Displacement (CC)',
            'Max Torque : 145 Nm,  14.8 kg-m and 4300 rpm',
            'Max Power : 121 PS , 89 kW and 6600 rpm',
            'Electronic Fuel Injection (PGM-FI)',
            'Continuous Variable Transmission (CVT)',
            'Electric Power Steering (EPS)'
        ],
        'Perfomance': [
            '160 km/h Maximum speed',
            '11s of Accelaration of 0-100 km/h (secs)',
            'Fuel Consumption (L/100km) : 6.0'
        ],
        'Brake System': [
          'Front :	Ventilated Disc',
          'Rear :	Drum',
          'Parking Brake :	Hand Brake Lever'
        ],
        'Suspension System':[
          'Front : MacPherson Strut',
          'Rear : Torsion Beam'
        ],
        'Dimension': [
          'Length (mm)	4,060',
          'Width (mm)	1,780',
          'Height (mm)	1,608',
          'Wheelbase (mm)	2,485',
          'Tread Front (mm)	1,540',
          'Tread Rear (mm)	1,540',
          'Curb Weight (kg)	1,111',
          'Ground Clearance (mm) 207',
          'Fuel Tank Capacity (litre) 40',
          'Boot Capacity (Litre)	380'
        ],
        'Tyres' :[
          'Wheel Type : Alloy (Black)',
          'Wheel Size :	17',
          'Tyre Size	: 215/55/R17',
          'Spare Tyre Size : 17'
        ],
        'Exterior' : [
           'Headlights	: LED',
            'Auto Headlights : ✓',
            'Daytime Running Lights	: LED',
            'Front Fog Lights : LED',
            'Front LED Sequential Turn Signals : LED',
            'Side Mirrors With Turning Lights : ✓',
            'Outer Door Handle : Body Colour',
            'Rear Combi Lights : LED',
            'Antenna	: Shark Fin'
        ],
        'Control & Interior' :[
          'Remote Engine Start : ✓',
          'Walk Away Auto Lock : ✓',
          'Smart Entry with Push Start Button : ✓',
          'Paddle Shift : -',
          'Cruise Control : ✓',
          'Meter Cluster : 4.2" TFT Meter',
          'Air Conditioning	: Single Auto',
          'Air Conditioning Control	: Switch',
          'Steering Wheel :	Leather^',
          'Gear Knob Type	: Urethane',
          'Upholstery	: Leather^ + Fabric with Blue Stitchings',
          'Wireless Charger : -',
          'Ambient Lighting : -',
          'Rear Wiper System : ✓',
          'Steering Wheel Switch Audio Control : ✓',
          'Pedal Pad Type	: Normal',
          'Power Adjustable Door Mirror : ✓',
          'Power Retractable Door Mirror : ✓',
          'Centre Console with Armrest	: Leather',
          'Rear Accessory Socket : 1'
        ],
        'Audio':[
          'Audio System	Standard Audio : 10” Display Audio',
          'Apple CarPlay™ & Android Auto™ Connectivity* : ✓ Wireless',
          'USB Port	: 2',
          'Hands‑Free Telephone (HFT) : ✓',
          'Speakers	: 6',
          'Bluetooth	: ✓'
        ],
        'Safety & Security':[
          'Dual Front SRS Airbags: ✓',
          'Side Airbags: ✓',
          'Side Curtain Airbags: -',
          'Total Airbags: 4',
          'Driver Seatbelt Reminder: ✓',
          'Assistant Seatbelt Reminder: ✓',
          'Rear Seat Reminder: ✓',
          'ISOFIX I‑Size Type: ✓',
          'Auto Door Lock: ✓',
          'Vehicle Stability Assist (VSA): ✓',
          'Anti‑Lock Braking System (ABS): ✓',
          'Electronic Brake Distribution (EBD): ✓',
          'Hill Start Assist (HSA): ✓',
          'Emergency Stop Signal (ESS): ✓',
          'Reverse Sensors: 2',
          'Reverse Camera: Multi-Angle',
          '360-Degree Camera: -',
          'Honda LaneWatch Camera (LWC): ✓',
          'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, AHB, LCDN): ✓',
          'Forward Collision Warning (FCW): ✓',
          'Collision Mitigation Braking System (CMBS): ✓',
          'Lane Keep Assist System (LKAS): ✓',
          'Lane Departure Warning (LDW): ✓',
          'Road Departure Mitigation (RDM): ✓',
          'Adaptive Cruise Control (ACC): ✓',
          'Auto High Beam: ✓',
          'Lead Car Departure Notification: ✓',
          'Honda CONNECT (Safety, Security, Convenience): -',
          'Security Alarm with Immobiliser: ✓'
        ]
    },
    'Variant 3': {
        'Engine': [
            '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
            '1,498 Displacement (CC)',
            'Max Torque : 145 Nm,  14.8 kg-m and 4300 rpm',
            'Max Power : 121 PS , 89 kW and 6600 rpm',
            'Electronic Fuel Injection (PGM-FI)',
            'Continuous Variable Transmission (CVT)',
            'Electric Power Steering (EPS)'
        ],
        'Perfomance': [
            '160 km/h Maximum speed',
            '11.2s of Accelaration of 0-100 km/h (secs)',
            'Fuel Consumption (L/100km) : 6.0'
        ],
        'Brake System': [
          'Front :	Ventilated Disc',
          'Rear :	Drum',
          'Parking Brake :	Hand Brake Lever'
        ],
        'Suspension System':[
          'Front : MacPherson Strut',
          'Rear : Torsion Beam'
        ],
        'Dimension': [
          'Length (mm)	4,060',
          'Width (mm)	1,780',
          'Height (mm)	1,608',
          'Wheelbase (mm)	2,485',
          'Tread Front (mm)	1,540',
          'Tread Rear (mm)	1,540',
          'Curb Weight (kg)	1,111',
          'Ground Clearance (mm) 207',
          'Fuel Tank Capacity (litre) 40',
          'Boot Capacity (Litre)	380'
        ],
        'Tyres' :[
          'Wheel Type : Alloy (Black)',
          'Wheel Size :	17',
          'Tyre Size	: 215/55/R17',
          'Spare Tyre Size : 17'
        ],
        'Exterior' : [
           'Headlights	: LED',
            'Auto Headlights : ✓',
            'Daytime Running Lights	: LED',
            'Front Fog Lights : LED',
            'Front LED Sequential Turn Signals : LED with Sequential',
            'Side Mirrors With Turning Lights : ✓',
            'Outer Door Handle : Black',
            'Rear Combi Lights : LED',
            'Antenna	: Shark Fin',
            'Two-Tone Paint (Blazing Red Pearl with Black Roof) : ✓'
        ],
        'Control & Interior' :[
          'Remote Engine Start : ✓',
          'Walk Away Auto Lock : ✓',
          'Smart Entry with Push Start Button : ✓',
          'Paddle Shift : ✓',
          'Cruise Control : ✓',
          'Meter Cluster : 4.2" TFT Meter',
          'Air Conditioning	: Single Auto',
          'Air Conditioning Control	: Switch',
          'Steering Wheel :	Leather^',
          'Gear Knob Type	: Urethane',
          'Upholstery	: Leather^ + Fabric with Red Stitchings',
          'Wireless Charger : ✓',
          'Ambient Lighting : ✓ Red',
          'Rear Wiper System : ✓',
          'Steering Wheel Switch Audio Control : ✓',
          'Pedal Pad Type	: Normal',
          'Power Adjustable Door Mirror : ✓',
          'Power Retractable Door Mirror : ✓',
          'Centre Console with Armrest	: Leather',
          'Rear Accessory Socket : 1'
        ],
        'Audio':[
          'Audio System	Standard Audio : 10” Display Audio',
          'Apple CarPlay™ & Android Auto™ Connectivity* : ✓ Wireless',
          'USB Port	: 2',
          'Hands‑Free Telephone (HFT) : ✓',
          'Speakers	: 6',
          'Bluetooth	: ✓'
        ],
        'Safety & Security':[
          'Dual Front SRS Airbags: ✓',
          'Side Airbags: ✓',
          'Side Curtain Airbags: ✓',
          'Total Airbags: 6',
          'Driver Seatbelt Reminder: ✓',
          'Assistant Seatbelt Reminder: ✓',
          'Rear Seat Reminder: ✓',
          'ISOFIX I‑Size Type: ✓',
          'Auto Door Lock: ✓',
          'Vehicle Stability Assist (VSA): ✓',
          'Anti‑Lock Braking System (ABS): ✓',
          'Electronic Brake Distribution (EBD): ✓',
          'Hill Start Assist (HSA): ✓',
          'Emergency Stop Signal (ESS): ✓',
          'Reverse Sensors: 2',
          'Reverse Camera: Multi-Angle',
          '360-Degree Camera: ✓',
          'Honda LaneWatch Camera (LWC): ✓',
          'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, AHB, LCDN): ✓',
          'Forward Collision Warning (FCW): ✓',
          'Collision Mitigation Braking System (CMBS): ✓',
          'Lane Keep Assist System (LKAS): ✓',
          'Lane Departure Warning (LDW): ✓',
          'Road Departure Mitigation (RDM): ✓',
          'Adaptive Cruise Control (ACC): ✓',
          'Auto High Beam: ✓',
          'Lead Car Departure Notification: ✓',
          'Honda CONNECT (Safety, Security, Convenience): ✓',
          'Security Alarm with Immobiliser: ✓'
        ]
    },
    // Add more variants here
  },
  'Honda CRV'             : {
    'Variant 1': {
      'Engine & Perfomance': [
          '2.0 litre DOHC i-VTEC (Atkinson Cycle) four-cylinder engine',
          '148 PS (146 hp) at 6,100 rpm, 190 Nm at 4,500 rpm',
          '184 PS (181 hp, or 135 kW) at 5,000 to 8,000 rpm and 335 Nm from 0-2,000 rpm e-motor',
          'Direct Fuel Injection (PGM‑FI)',
          'Electric continuously variable transmission (e-CVT)',
          'Electric Power Steering (EPS)',
          '2 Wheel Drive'
      ],
      'Perfomance' :[
        '0-100 km/h in 9.0 seconds',
        'Maximum speed of 187 (km/h)',
        'Fuel consumption of 5.0 (L/100km)'
      ],
      'Brake System': [
        'Front :	Ventilated Disc',
        'Rear :	Solid Disc',
        'Parking Brake :	Electric Parking Brake'
      ],
      'Suspension System':[
        'Front : MacPherson Strut',
        'Rear : Multi Link',
        'Variable Gear Ratio (VGR): ✓'
      ],
      'Dimension': [
        'Length (mm)	4,691',
        'Width (mm)	1,866',
        'Height (mm)	1,681',
        'Wheelbase (mm)	2,701',
        'Tread Front (mm)	1,611',
        'Tread Rear (mm)	1,627',
        'Curb Weight (kg)	1,735',
        'Fuel Tank Capacity (litre) 57',
        'Boot Capacity (Litre)	589'
      ],
      'Tyres' :[
        'Wheel Type : Alloy',
        'Wheel Size :	18"Silver',
        'Tyre Size	: 235/60R18',
        'Spare Tyre Size : 18'
      ],
      'Exterior' : [
        'Headlights	: LED',
          'Auto Headlights : ✓',	
          'Active Cornering Lights : ✓',
          'Daytime Running Lights	: LED',
          'Front Fog Lights : LED',
          'Rear Fog Light : ✓',
          'Front LED Sequential Turn Signals ✓',
          'Side Mirrors With Turning Lights : Body Colour with LED Turn Light',	
          'Outer Door Handle : Body Colour',
          'Rear Combi Lights :  (LED)',
          'Antenna	: Shark Fin (Body Colour)',
          'Roof Rail : ✓',
          'Hands‑Free Power Tailgate With Walkaway Close : ✓',
          'Active Shutter Grille : ✓',
          'Tailpipe Chrome Finisher : ✓'
      ],
      'Control & Interior' :[
        'Remote Engine Start : ✓',
        'Walk Away Auto Lock : ✓',
        'Smart Entry with Push Start Button : ✓',
        'Key Card : ✓',
        'Head up Display : ✓',
        'Paddle Shift : -',
        'Deceleration Selector Paddle :	✓',
        'Cruise Control : ✓',
        'ECON Button : ✓',
        'SPORT Button: ✓',
        'Meter Cluster : 10.2” TFT Meter',
        'Air Conditioning	: Dual Auto',
        'Rear Air Conditioning Ventilation : ✓',
        'Auto Dim Rearview Mirror : -',
        'Steering Wheel :	Leather^',
        'Upholstery	: Leather^',
        '4‑Way Assistant Power Seat: ✓',
        '8‑Way Driver Power Seat : ✓',
        'Memory Seat : ✓',
        '2nd Row Sliding Seat : ✓',
        'Auto Front Wiper : ✓',
        'Rear Wiper System: ✓',
        'Pedal Pad Type	: Normal',
        'Power Adjustable Door Mirror : ✓',
        'Power Retractable Door Mirror : ✓',
        'Centre Console with Armrest	: ✓',
        'Auto Dim Rearview Mirror : ✓',
        'Front Roof Ambient Light : ✓',
        'Front Foot Ambient Light : ✓',
        'Cup Holder Light : ✓',
        'Front Door Inner Handle Light : ✓',
        'Front Door Inner Handle Line Illumination : ✓',
        'Wireless Charger (15W) : ✓',
        'Rear USB Charger : 2'
      ],
      'Audio':[
        'Audio System	Standard Audio : 9” Advanced Display Audio',
        'Apple CarPlay™ & Android Auto™ Connectivity* : ✓ with wireless Apple CarPlay™',
        'USB Port	: 2',
        'Hands‑Free Telephone (HFT) : ✓',
        'Speakers	: 8',
        'Bluetooth	: ✓'
      ],
      'Safety & Security':[
        'Dual Front SRS Airbags: ✓',
        'Side Airbags: ✓',
        'Side Curtain Airbags: ✓',
        'Knee Airbags: ✓',
        'Driver Seatbelt Reminder: ✓',
        'Assistant Seatbelt Reminder: ✓',
        'Rear Seatbelt Reminder: ✓',
        'Rear Seat Reminder: ✓',
        'ISOFIX I‑Size Type: ✓',
        'Auto Door Lock: ✓',
        'Vehicle Stability Assist (VSA): ✓',
        'Agile Handle Assist (AHA): ✓',
        'Anti‑lock Braking System (ABS): ✓',
        'Electronic Brake Distribution (EBD): ✓',
        'Auto Brake Hold (ABH): ✓',
        'Hill Start Assist (HSA): ✓',
        'Hill Descent Control (HDC): ✓',
        'Emergency Stop Signal (ESS): ✓',
        'Front Sensors: 4',
        'Reverse Sensors: 4',
        'Reverse Camera: Multi-angle',
        'Multi View Camera System (360 Camera): ✓',
        'Reverse Auto Tilt Mirror: ✓',
        'Honda LaneWatch Camera (LWC): ✓',
        'Forward Collision Warning (FCW): ✓',
        'Collision Mitigation Braking System (CMBS): ✓',
        'Lane Keep Assist System (LKAS): ✓',
        'Lane Departure Warning (LDW): ✓',
        'Road Departure Mitigation (RDM): ✓',
        'Adaptive Cruise Control (ACC): ✓',
        'Low Speed Follow (LSF): ✓',
        'Auto High Beam (AHB): -',
        'Adaptive Driving Beam (ADB): ✓',
        'Lead Car Departure Notification System: ✓',
        'Honda CONNECT (Safety, Security, Convenience): ✓',
        'Driver Attention Monitor: ✓',
        'Active Noise Control: ✓',
        'Active Sound Control: ✓',
        'Tire Pressure Monitoring System (TPMS): ✓',
        'Security Alarm with Immobiliser: ✓'
      ]
    },
    'Variant 2': {
      'Engine & Perfomance': [
          '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
          '193 PS (142 hp) at 6,000 rpm, 243 Nm at 5,000 rpm',
          'Direct Fuel Injection (PGM‑FI)',
          'Continuous Variable Transmission (CVT)',
          'Electric Power Steering (EPS)',
          'Real-Time AWD system'
      ],
      'Perfomance' :[
        '0-100 km/h in 9.7 seconds',
        'Maximum speed of 200 (km/h)',
        'Fuel consumption of 7.0 (L/100km)'
      ],
      'Brake System': [
        'Front :	Ventilated Disc',
        'Rear :	Solid Disc',
        'Parking Brake :	Electric Parking Brake'
      ],
      'Suspension System':[
        'Front : MacPherson Strut',
        'Rear : Multi Link',
        'Variable Gear Ratio (VGR): ✓'
      ],
      'Dimension': [
        'Length (mm)	4,691',
        'Width (mm)	1,866',
        'Height (mm)	1,681',
        'Wheelbase (mm)	2,701',
        'Tread Front (mm)	1,611',
        'Tread Rear (mm)	1,627',
        'Curb Weight (kg)	1,616',
        'Fuel Tank Capacity (litre) 57',
        'Boot Capacity (Litre)	589'
      ],
      'Tyres' :[
        'Wheel Type : Alloy',
        'Wheel Size :	18"Silver',
        'Tyre Size	: 235/60R18',
        'Spare Tyre Size : 18'
      ],
      'Exterior' : [
        'Headlights	: LED',
          'Auto Headlights : ✓',	
          'Active Cornering Lights : -',
          'Daytime Running Lights	: LED',
          'Front Fog Lights : LED',
          'Rear Fog Light : -',
          'Front LED Sequential Turn Signals ✓',
          'Side Mirrors With Turning Lights : Body Colour with LED Turn Light',	
          'Outer Door Handle : Body Colour',
          'Rear Combi Lights :  (LED)',
          'Antenna	: Shark Fin (Body Colour)',
          'Roof Rail : -',
          'Hands‑Free Power Tailgate With Walkaway Close : ✓',
          'Active Shutter Grille : -',
          'Tailpipe Chrome Finisher : ✓'
      ],
      'Control & Interior' :[
        'Remote Engine Start : ✓',
        'Walk Away Auto Lock : ✓',
        'Smart Entry with Push Start Button : ✓',
        'Key Card : -',
        'Head up Display : -',
        'Paddle Shift : ✓',
        'Deceleration Selector Paddle :	-',
        'Cruise Control : ✓',
        'ECON Button : ✓',
        'SPORT Button: - ',
        'Meter Cluster : 7” TFT Meter',
        'Air Conditioning	: Dual Auto',
        'Rear Air Conditioning Ventilation : ✓',
        'Auto Dim Rearview Mirror : -',
        'Steering Wheel :	Leather^',
        'Upholstery	: Leather^',
        '4‑Way Assistant Power Seat: ✓',
        '8‑Way Driver Power Seat : ✓',
        'Memory Seat : ✓',
        '2nd Row Sliding Seat : ✓',
        'Auto Front Wiper : ✓',
        'Rear Wiper System: ✓',
        'Pedal Pad Type	: Normal',
        'Power Adjustable Door Mirror : ✓',
        'Power Retractable Door Mirror : ✓',
        'Centre Console with Armrest	: ✓',
        'Auto Dim Rearview Mirror : ✓',
        'Front Roof Ambient Light : ✓',
        'Front Foot Ambient Light : ✓',
        'Cup Holder Light : ✓',
        'Front Door Inner Handle Light : ✓',
        'Front Door Inner Handle Line Illumination : ✓',
        'Wireless Charger (15W) : ✓',
        'Rear USB Charger : 2'
      ],
      'Audio':[
        'Audio System	Standard Audio : 9” Advanced Display Audio',
        'Apple CarPlay™ & Android Auto™ Connectivity* : ✓ with wireless Apple CarPlay™',
        'USB Port	: 2',
        'Hands‑Free Telephone (HFT) : ✓',
        'Speakers	: 8',
        'Bluetooth	: ✓'
      ],
      'Safety & Security':[
        'Dual Front SRS Airbags: ✓',
        'Side Airbags: ✓',
        'Side Curtain Airbags: ✓',
        'Knee Airbags: ✓',
        'Driver Seatbelt Reminder: ✓',
        'Assistant Seatbelt Reminder: ✓',
        'Rear Seatbelt Reminder: ✓',
        'Rear Seat Reminder: ✓',
        'ISOFIX I‑Size Type: ✓',
        'Auto Door Lock: ✓',
        'Vehicle Stability Assist (VSA): ✓',
        'Agile Handle Assist (AHA): ✓',
        'Anti‑lock Braking System (ABS): ✓',
        'Electronic Brake Distribution (EBD): ✓',
        'Auto Brake Hold (ABH): ✓',
        'Hill Start Assist (HSA): ✓',
        'Hill Descent Control (HDC): ✓',
        'Emergency Stop Signal (ESS): ✓',
        'Front Sensors: 4',
        'Reverse Sensors: 4',
        'Reverse Camera: Multi-angle',
        'Multi View Camera System (360 Camera): ✓',
        'Reverse Auto Tilt Mirror: ✓',
        'Honda LaneWatch Camera (LWC): ✓',
        'Forward Collision Warning (FCW): ✓',
        'Collision Mitigation Braking System (CMBS): ✓',
        'Lane Keep Assist System (LKAS): ✓',
        'Lane Departure Warning (LDW): ✓',
        'Road Departure Mitigation (RDM): ✓',
        'Adaptive Cruise Control (ACC): ✓',
        'Low Speed Follow (LSF): ✓',
        'Auto High Beam (AHB): ✓',
        'Adaptive Driving Beam (ADB): -',
        'Lead Car Departure Notification System: ✓',
        'Honda CONNECT (Safety, Security, Convenience): ✓',
        'Driver Attention Monitor: ✓',
        'Active Noise Control: ✓',
        'Active Sound Control: -',
        'Tire Pressure Monitoring System (TPMS): ✓',
        'Security Alarm with Immobiliser: ✓'
      ]
    },
    'Variant 3': {
      'Engine & Perfomance': [
          '2.0 litre DOHC i-VTEC (Atkinson Cycle) four-cylinder engine',
          '148 PS (146 hp) at 6,100 rpm, 190 Nm at 4,500 rpm',
          '184 PS (181 hp, or 135 kW) at 5,000 to 8,000 rpm and 335 Nm from 0-2,000 rpm e-motor',
          'Direct Fuel Injection (PGM‑FI)',
          'Electric continuously variable transmission (e-CVT)',
          'Electric Power Steering (EPS)',
          '2 Wheel Drive'
      ],
      'Perfomance' :[
        '0-100 km/h in 9.0 seconds',
        'Maximum speed of 187 (km/h)',
        'Fuel consumption of 5.0 (L/100km)'
      ],
      'Brake System': [
        'Front :	Ventilated Disc',
        'Rear :	Solid Disc',
        'Parking Brake :	Electric Parking Brake'
      ],
      'Suspension System':[
        'Front : MacPherson Strut',
        'Rear : Multi Link',
        'Variable Gear Ratio (VGR): ✓'
      ],
      'Dimension': [
        'Length (mm)	4,691',
        'Width (mm)	1,866',
        'Height (mm)	1,681',
        'Wheelbase (mm)	2,701',
        'Tread Front (mm)	1,611',
        'Tread Rear (mm)	1,627',
        'Curb Weight (kg)	1,735',
        'Fuel Tank Capacity (litre) 57',
        'Boot Capacity (Litre)	589'
      ],
      'Tyres' :[
        'Wheel Type : Alloy',
        'Wheel Size :	18"Silver',
        'Tyre Size	: 235/60R18',
        'Spare Tyre Size : 18'
      ],
      'Exterior' : [
        'Headlights	: LED',
          'Auto Headlights : ✓',	
          'Active Cornering Lights : ✓',
          'Daytime Running Lights	: LED',
          'Front Fog Lights : LED',
          'Rear Fog Light : ✓',
          'Front LED Sequential Turn Signals ✓',
          'Side Mirrors With Turning Lights : Body Colour with LED Turn Light',	
          'Outer Door Handle : Body Colour',
          'Rear Combi Lights :  (LED)',
          'Antenna	: Shark Fin (Body Colour)',
          'Roof Rail : ✓',
          'Hands‑Free Power Tailgate With Walkaway Close : ✓',
          'Active Shutter Grille : ✓',
          'Tailpipe Chrome Finisher : ✓'
      ],
      'Control & Interior' :[
        'Remote Engine Start : ✓',
        'Walk Away Auto Lock : ✓',
        'Smart Entry with Push Start Button : ✓',
        'Key Card : ✓',
        'Head up Display : ✓',
        'Paddle Shift : -',
        'Deceleration Selector Paddle :	✓',
        'Cruise Control : ✓',
        'ECON Button : ✓',
        'SPORT Button: ✓',
        'Meter Cluster : 10.2” TFT Meter',
        'Air Conditioning	: Dual Auto',
        'Rear Air Conditioning Ventilation : ✓',
        'Auto Dim Rearview Mirror : -',
        'Steering Wheel :	Leather^',
        'Upholstery	: Leather^',
        '4‑Way Assistant Power Seat: ✓',
        '8‑Way Driver Power Seat : ✓',
        'Memory Seat : ✓',
        '2nd Row Sliding Seat : ✓',
        'Auto Front Wiper : ✓',
        'Rear Wiper System: ✓',
        'Pedal Pad Type	: Normal',
        'Power Adjustable Door Mirror : ✓',
        'Power Retractable Door Mirror : ✓',
        'Centre Console with Armrest	: ✓',
        'Auto Dim Rearview Mirror : ✓',
        'Front Roof Ambient Light : ✓',
        'Front Foot Ambient Light : ✓',
        'Cup Holder Light : ✓',
        'Front Door Inner Handle Light : ✓',
        'Front Door Inner Handle Line Illumination : ✓',
        'Wireless Charger (15W) : ✓',
        'Rear USB Charger : 2'
      ],
      'Audio':[
        'Audio System	Standard Audio : 9” Advanced Display Audio',
        'Apple CarPlay™ & Android Auto™ Connectivity* : ✓ with wireless Apple CarPlay™',
        'USB Port	: 2',
        'Hands‑Free Telephone (HFT) : ✓',
        'Speakers	: 8',
        'Bluetooth	: ✓'
      ],
      'Safety & Security':[
        'Dual Front SRS Airbags: ✓',
        'Side Airbags: ✓',
        'Side Curtain Airbags: ✓',
        'Knee Airbags: ✓',
        'Driver Seatbelt Reminder: ✓',
        'Assistant Seatbelt Reminder: ✓',
        'Rear Seatbelt Reminder: ✓',
        'Rear Seat Reminder: ✓',
        'ISOFIX I‑Size Type: ✓',
        'Auto Door Lock: ✓',
        'Vehicle Stability Assist (VSA): ✓',
        'Agile Handle Assist (AHA): ✓',
        'Anti‑lock Braking System (ABS): ✓',
        'Electronic Brake Distribution (EBD): ✓',
        'Auto Brake Hold (ABH): ✓',
        'Hill Start Assist (HSA): ✓',
        'Hill Descent Control (HDC): ✓',
        'Emergency Stop Signal (ESS): ✓',
        'Front Sensors: 4',
        'Reverse Sensors: 4',
        'Reverse Camera: Multi-angle',
        'Multi View Camera System (360 Camera): ✓',
        'Reverse Auto Tilt Mirror: ✓',
        'Honda LaneWatch Camera (LWC): ✓',
        'Forward Collision Warning (FCW): ✓',
        'Collision Mitigation Braking System (CMBS): ✓',
        'Lane Keep Assist System (LKAS): ✓',
        'Lane Departure Warning (LDW): ✓',
        'Road Departure Mitigation (RDM): ✓',
        'Adaptive Cruise Control (ACC): ✓',
        'Low Speed Follow (LSF): ✓',
        'Auto High Beam (AHB): -',
        'Adaptive Driving Beam (ADB): ✓',
        'Lead Car Departure Notification System: ✓',
        'Honda CONNECT (Safety, Security, Convenience): ✓',
        'Driver Attention Monitor: ✓',
        'Active Noise Control: ✓',
        'Active Sound Control: ✓',
        'Tire Pressure Monitoring System (TPMS): ✓',
        'Security Alarm with Immobiliser: ✓'
      ]
    },
  },
  'Honda RS'              :{
    'Variant 1': {
      'Engine & Perfomance': [
          '2.0 litre DOHC VTEC Turbo naturally-aspirated four-cylinder engine',
          '319 PS (315 hp) at 6,500 rpm, 420 Nm at 4,000 rpm',
          'Direct Fuel Injection (PGM‑FI)',
          '6 Speed Manual',
          'Electric Power Steering (EPS)',
          '2 Wheel Drive'
      ],
      'Perfomance' :[
        '0-100 km/h in 5.5 seconds',
        'Maximum speed of 272 (km/h)',
        'Fuel consumption of 8.3 (L/100km)'
      ],
      'Brake System': [
        'Front :	Brembo Ventilated Disc',
        'Rear :	Solid Disc',
        'Parking Brake :	Electric Parking Brake'
      ],
      'Suspension System':[
        'Front : Dual Axis Strut',
        'Rear : Multi Link',
        'Adaptive Damper System: ✓'
      ],
      'Dimension': [
        'Length (mm)	4,593',
        'Width (mm)	1,890',
        'Height (mm)	1,407',
        'Wheelbase (mm)	2,735',
        'Tread Front (mm)	1,626',
        'Tread Rear (mm)	1,614',
        'Curb Weight (kg)	1,428',
        'Fuel Tank Capacity (litre) 47',
        'Boot Capacity (Litre)	410'
      ],
      'Tyres' :[
        'Wheel Type : Alloy',
        'Wheel Size :	19',
        'Tyre Size	: 265/30/ZR19',
        'Spare Tyre Size : Temporary Repair Kit'
      ],
      'Exterior' : [
        'Headlights	: LED',
          'Auto Headlights : ✓',	
          'Active Cornering Lights : -',
          'Daytime Running Lights	: LED',
          'Front Fog Lights : -',
          'Rear Fog Light : -',
          'Front LED Sequential Turn Signals ✓',
          'Side Mirrors With Turning Lights : ✓',	
          'Outer Door Handle : Body Colour',
          'Tailgate Spiler : Type R Wing',
          'Rear Combi Lights :  (LED)',
          'Antenna	: Shark Fin (Body Colour)',
          'Active Exhaust Valve  : ✓',
          'Tailpipe Chrome Finisher : ✓'
      ],
      'Control & Interior' :[
        'Rev Match System : ✓',
        'Walk Away Auto Lock : ✓',
        'Smart Entry with Push Start Button : ✓',
        'Key Card : ✓',
        'Cruise Control : ✓',
        'Drive Mode Selector: Comfort, Sport, +R & Individual Mode',
        'Meter Cluster : 10.2” TFT Meter',
        'Air Conditioning	: Dual Auto',
        'Auto Dim Rearview Mirror : ✓',
        'Steering Wheel :	Type R Alcantara',
        'Upholstery	: Suede‑style Fabric',
        'Front Seat Type : Type R Sport Seats',
        '60:40 Seats : ✓',
        'Auto Front Wiper  : ✓',
        'Rear Wiper System : ✓',
        'Smart Clear Wiper : ✓',
        'Steering Wheel Switch Audio Control : ✓',
        'Pedal Pad Type	: Sport',
        'Auto Retractable Door Mirror : ✓',
        'Centre Console with Armrest	: ✓',
        'Auto Dim Rearview Mirror : ✓',
        'Front Foot Light : ✓',
        'Front Roof Ambient Light : LED',
        'Front Foot Ambient Light : ✓',
        'Tonneau Cover : ✓',
        'Wireless Charger (15W) : ✓',
        'Active Sound Control : ✓'
      ],
      'Audio':[
        'Audio System	Standard Audio : 9” Advanced Display Audio',
        'Apple CarPlay™ & Android Auto™ Connectivity* : ✓  with wireless Apple CarPlay™',
        'USB Port	: 2',
        'Hands‑Free Telephone (HFT) : ✓',
        'Speakers	: 8',
        'Bluetooth	: ✓',
        'Log R Data Logger: ✓'
      ],
      'Safety & Security':[
         'Dual Front SRS Airbags: ✓',
        'Side Airbags: ✓',
        'Side Curtain Airbags: ✓',
        'Dual Front Knee Airbags: ✓',
        'Front & Rear Seatbelt Reminder: ✓',
        'Rear Seat Reminder: ✓',
        'ISOFIX I‑Size Type: ✓',
        'Auto Door Lock: ✓',
        'Vehicle Stability Assist (VSA): ✓',
        'Limited Slip Differential (LSD): ✓',
        'Agile Handle Assist (AHA): ✓',
        'Anti‑lock Braking System (ABS): ✓',
        'Electronic Brake Distribution (EBD): ✓',
        'Auto Brake Hold (ABH): ✓',
        'Hill Start Assist (HSA): ✓',
        'Front Sensors: ✓',
        'Reverse Sensors: ✓',
        'Reverse Camera: ✓',
        'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, AHB, LCDN): ✓',
        'Honda CONNECT (Safety, Security, Convenience): ✓',
        'Driver Attention Monitor: ✓',
        'Security Alarm with Immobiliser: ✓'
      ]
    },
  },
  'Honda Prelude'         :{
    'Variant 1': {
      'Engine & Perfomance': [
          '2.0 litre DOHC i-VTEC Atkinson cycle four-cylinder engine (e:HEV)',
          '1,993 Displacement (CC)',
          'Engine : 141 PS at 6,000 rpm, 182 Nm at 4,500 rpm',
          'Electric Motor : 184 PS, 315 Nm',
          'Total System Output : 203 PS (149 kW)',
          'Lithium-Ion Battery : 1.05 kWh (72 cell)',
          'e-CVT with S+ Shift',
          'Electric Power Steering (EPS)',
          '2 Wheel Drive'
      ],
      'Perfomance' :[
        '0-100 km/h in 8.2 seconds',
        'Maximum speed of 188 (km/h)',
        'Fuel consumption of 4.2 (L/100km)'
      ],
      'Brake System': [
        'Front :	Brembo Ventilated Disc (13.8 inch)',
        'Rear :	Disc (12 inch)',
        'Parking Brake :	Electric Parking Brake'
      ],
      'Suspension System':[
        'Front : Dual Axis Strut',
        'Rear : Multi Link',
        'Adaptive Damper System: ✓'
      ],
      'Dimension': [
        'Length (mm)	4,522',
        'Width (mm)	1,880',
        'Height (mm)	1,355',
        'Wheelbase (mm)	2,605',
        'Curb Weight (kg)	1,469',
        'Seating Capacity	2+2',
        'Boot Capacity (Litre)	264'
      ],
      'Tyres' :[
        'Wheel Type : Alloy (Berlina Black)',
        'Wheel Size :	19',
        'Tyre Size	: 235/40 R19',
        'Spare Tyre Size : Temporary Repair Kit'
      ],
      'Exterior' : [
        'Headlights	: LED',
          'Auto Headlights : ✓',
          'Active Cornering Lights : ✓',
          'Daytime Running Lights	: LED',
          'Side Mirrors With Turning Lights : ✓',
          'Outer Door Handle : Body Colour',
          'Rear Combi Lights :  (LED)',
          'Antenna	: Shark Fin (Body Colour)',
          'Exterior Colours : Winter Frost Pearl, Rallye Red, Crystal Black Pearl'
      ],
      'Control & Interior' :[
        'Walk Away Auto Lock : ✓',
        'Smart Entry with Push Start Button : ✓',
        'Cruise Control : Adaptive Cruise Control',
        'Drive Mode Selector: Comfort, GT, Sport & Individual Mode',
        'Meter Cluster : 10.2” Full Digital TFT Meter',
        'Air Conditioning	: Dual Auto',
        'Auto Dim Rearview Mirror : ✓',
        'Steering Wheel :	Flat-Bottom Leather Wrapped',
        'Front Seat Adjustment : 6-Way Driver, 4-Way Passenger',
        'Auto Front Wiper  : ✓',
        'Rear Wiper System : ✓',
        'Steering Wheel Switch Audio Control : ✓',
        'Pedal Pad Type	: Sport',
        'Auto Retractable Door Mirror : ✓',
        'Centre Console with Armrest	: ✓',
        'Wireless Charger : ✓',
        'Active Sound Control : ✓',
        'Coasting Control Operation : ✓'
      ],
      'Audio':[
        'Audio System	Standard Audio : 9” Display Audio with Google Built-in',
        'Apple CarPlay™ & Android Auto™ Connectivity* : ✓  Wireless',
        'USB Port	: 2 (Type-C)',
        'Hands‑Free Telephone (HFT) : ✓',
        'Speakers	: 8 (BOSE Premium Sound System)',
        'Bluetooth	: ✓'
      ],
      'Safety & Security':[
        'Dual Front SRS Airbags: ✓',
        'Side Airbags: ✓',
        'Side Curtain Airbags: ✓',
        'Driver Knee Airbag: ✓ (7 Airbags in total)',
        'Front & Rear Seatbelt Reminder: ✓',
        'ISOFIX I‑Size Type: ✓',
        'Auto Door Lock: ✓',
        'Vehicle Stability Assist (VSA): ✓',
        'Agile Handle Assist (AHA): ✓',
        'Anti‑lock Braking System (ABS): ✓',
        'Electronic Brake Distribution (EBD): ✓',
        'Auto Brake Hold (ABH): ✓',
        'Hill Start Assist (HSA): ✓',
        'Front Sensors: ✓ (4)',
        'Reverse Sensors: ✓ (4)',
        'Reverse Camera: ✓',
        'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, AHB, LCDN): ✓',
        'Blind Spot Information with Cross Traffic Monitor: ✓',
        'Honda CONNECT (Safety, Security, Convenience): ✓',
        'Driver Attention Monitor: ✓',
        'Security Alarm with Immobiliser: ✓'
      ]
    },
  },
  // Add more car models here
};

function createCarTable(model, variant) {
  const table = document.createElement('table');
  table.classList.add('car-table');
  table.id = `${model}-${variant}`;
  const headerRow = document.createElement('tr');
  const headerCategory = document.createElement('th');
  headerCategory.innerText = 'Category';
  const headerSpecification = document.createElement('th');
  headerSpecification.innerText = 'Specification';
  headerRow.appendChild(headerCategory);
  headerRow.appendChild(headerSpecification);
  table.appendChild(headerRow);

  const variantData = carData[model][variant];
  for (const category in variantData) {
      const row = document.createElement('tr');
      const categoryCell = document.createElement('td');
      categoryCell.innerText = category;
      const specificationCell = document.createElement('td');
      const specList = document.createElement('ul');

      variantData[category].forEach(spec => {
          const listItem = document.createElement('li');
          listItem.innerText = spec;
          specList.appendChild(listItem);
      });

      specificationCell.appendChild(specList);
      row.appendChild(categoryCell);
      row.appendChild(specificationCell);
      table.appendChild(row);
  }

  return table;
}

function populateTabs() {
  const tabs = {
    'HondaCity1': 'Honda City',
    'HondaCity2': 'Honda City',
    'HondaCity3': 'Honda City',
    'HondaCity4': 'Honda City',
    'CityHatchback1' : 'Honda City Hatchback',
    'CityHatchback2' : 'Honda City Hatchback',
    'CityHatchback3' : 'Honda City Hatchback',
    'Civic1' : 'Honda Civic',
    'Civic2' : 'Honda Civic',
    'Civic3' : 'Honda Civic',
    'Civic4' : 'Honda Civic',
    'Hrv1' : 'Honda HRV',
    'Hrv2' : 'Honda HRV',
    'Hrv3' : 'Honda HRV',
    'Hrv4' : 'Honda HRV',
    'Wrv1' : 'Honda WRV',
    'Wrv2' : 'Honda WRV',
    'Wrv3' : 'Honda WRV',
    'Crv1' : 'Honda CRV',
    'Crv2' : 'Honda CRV',
    'Crv3' : 'Honda CRV',
    'TyperR1'  : 'Honda RS',
    'Prelude1' : 'Honda Prelude',
};


for (const [tabId, model] of Object.entries(tabs)) {
  const variantNumber = tabId.match(/\d$/) ? tabId.match(/\d$/)[0] : '1';
  const variant = `Variant ${variantNumber}`;
  const tabContent = document.getElementById(tabId);
  
  if (carData[model] && carData[model][variant]) {
      const table = createCarTable(model, variant);
      tabContent.appendChild(table);
  } else {
      console.warn(`No data found for model: ${model}, variant: ${variant}`);
  }
}
}

populateTabs();


/*Salesman Part */

/*=============== SWIPER JS ===============*/
let swiperCards = new Swiper(".card__content", {
  loop: true,
  spaceBetween: 32,
  grabCursor: true,

  autoplay: {
    delay: 5000,
        disableOnInteraction: false,
    pauseOnMouseEnter: false,
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints:{
    600: {
      slidesPerView: 2,
    },
    968: {
      slidesPerView: 3,
    },
  },
});
const totalSlides = document.querySelectorAll(".card__article").length;

swiperCards.slideToLoop(Math.floor(Math.random() * totalSlides), 0);
// Modal functionality
const gridModal = document.getElementById("gridModal");
const openGridBtn = document.getElementById("openGridBtn");
const closeGridModalBtn = document.getElementById("closeGridModalBtn");
const gridItems = document.querySelectorAll('.grid-item');

openGridBtn.onclick = function() {
    gridModal.style.display = "block";
}

closeGridModalBtn.onclick = function() {
    gridModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == gridModal) {
        gridModal.style.display = "none";
    }
}
gridItems.forEach(item => {
  item.onclick = function() {
      const cardId = this.getAttribute('data-card-id');
      gridModal.style.display = "none";
console.log("Card Id : " +cardId);
const element = document.querySelector(`[data-card-id="${cardId}"]`);

if (element) {
  element.scrollIntoView({ behavior: 'smooth' });
} else {
  console.warn('Element not found');
}      
  }
});

//Open Modal1

function openModal() {
  document.getElementById("myModalPromotion").style.display = "block";
  document.body.style.overflow = "hidden"; // Disable scrolling

  document.addEventListener('keydown', evt => {
    if (evt.key === 'Escape') {
  document.getElementById("myModalPromotion").style.display = "none";
    }
});
}

function closeModal() {
  document.getElementById("myModalPromotion").style.display = "none";
  document.body.style.overflow = "auto"; // Enable scrolling


document.addEventListener('keydown', evt => {
   
   closeModal();
});

}


var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";

}

//Open Modal 2


function openModal2() {
  document.getElementById("myModalInsurance").style.display = "block";
  document.body.style.overflow = "hidden"; // Disable scrolling

  document.addEventListener('keydown', evt => {
    if (evt.key === 'Escape') {
  document.getElementById("myModalInsurance").style.display = "none";
    }
});
}

function closeModal2() {
  document.getElementById("myModalInsurance").style.display = "none";
  document.body.style.overflow = "auto"; // Enable scrolling


document.addEventListener('keydown', evt => {
   
   closeModal();
});

}


var slideIndex2 = 1;
showSlides2(slideIndex2);

function plusSlides2(n) {
  showSlides2(slideIndex2 += n);
}

function currentSlide2(n) {
  showSlides2(slideIndex2 = n);
}

function showSlides2(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides2");
  var dots = document.getElementsByClassName("demo2");
  var captionText = document.getElementById("caption2");

  if (n > slides.length) 
  {slideIndex2 = 1}
  else if (n < 1) {slideIndex2 = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  
  slides[slideIndex2-1].style.display = "block";

}

//Time attribute

const time = () => {

  const activerow = document.querySelector('#activerow');

  const monday = document.querySelector('.monday');
  const tuesday = document.querySelector('.tuesday');
  const wednesday = document.querySelector('.wednesday');
  const thursday = document.querySelector('.thursday');
  const friday = document.querySelector('.friday');
  const saturday = document.querySelector('.saturday');
  const sunday = document.querySelector('.sunday');


  switch (new Date().getDay()) {

      case 1:
          monday.setAttribute("id", "activerow");
          break;
      case 2:
          tuesday.setAttribute("id", "activerow");
          break;
      case 3:
          wednesday.setAttribute("id", "activerow");
          break;
      case 4:
          thursday.setAttribute("id", "activerow");
          break;
      case 5:
          friday.setAttribute("id", "activerow");
          break;
      case 6:
          saturday.setAttribute("id", "activerow");
          break;
      case 0:
          sunday.setAttribute("id", "activerow");
          break;
  }

}
time();


document.addEventListener('DOMContentLoaded', function() {
  const whatsappButton = document.querySelector('.whatsapp-button');
  const whatsappChatBox = document.querySelector('.whatsapp-chat-box');
  const closeChat = document.querySelector('.close-chat');
  const sendButton = document.querySelector('.send-button');
  const messageInput = document.getElementById('whatsappMessage');
  const messageTime = document.getElementById('messageTime'); // Added
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;

  // Update the time in the chat box
  messageTime.textContent = currentTime;
  // Toggle chat box visibility
  whatsappButton.addEventListener('click', function() {
      whatsappChatBox.classList.toggle('show');
  });

  // Close chat box
  closeChat.addEventListener('click', function() {
      whatsappChatBox.classList.remove('show');
  });

  // Send message via WhatsApp API
  sendButton.addEventListener('click', function() {
      const message = messageInput.value.trim();
      if (message) {
          const whatsappURL = `https://api.whatsapp.com/send?phone=601110918380&text=${encodeURIComponent(message)}`;
          window.open(whatsappURL, '_blank');
      } else {
          alert("Please enter a message before sending.");
      }
  });
});


//Mobile toggle for product
window.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#Product .container');
  const containerMobile = document.querySelector('#Product .container-mobile');

  function toggleContainers() {
    if (window.innerWidth <= 768) {
      container.style.display = 'none';
      containerMobile.style.display = 'block';
    }
     else {
      container.style.display = 'block';
      containerMobile.style.display = 'none';
    }
  }

  toggleContainers();

  window.addEventListener('resize', toggleContainers);
});


document.addEventListener('DOMContentLoaded', function () {
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    const articles = Array.from(swiperWrapper.children);
    
    // Fisher-Yates Shuffle algorithm
    for (let i = articles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [articles[i], articles[j]] = [articles[j], articles[i]];
    }

    // Clear existing articles and append shuffled ones
    swiperWrapper.innerHTML = '';
    articles.forEach(article => swiperWrapper.appendChild(article));
});


//INTEREST LOAN CALCULATOR JS

(function ($) {
  var WidgetpiotnetformsFormBuilderHandlerRangeSliderannual_interest = function ($scope, $) {
      var $elements = $scope.find('[data-piotnetforms-range-slider]');

      if (!$elements.length) {
          return;
      }

      // EIR_MIN/EIR_MAX are effective interest rates, not flat rates. Rebased
      // from the old 1.50-6.00 flat range when the calculator moved to reducing
      // balance for the Hire-Purchase (Amendment) Act 2026.
      //
      // 3.00-9.00 covers the real market: the cheapest new-car deals sit near
      // 4.3-4.9% EIR (2.30-2.55% flat) and a Honda promo rate bottoms out
      // around 3.5% EIR (1.88% flat), so 3.00 is a floor nobody will hit by
      // accident; 9.00% EIR (~4.9% flat) is past anything a new Honda attracts.
      // The span is also chosen so the slider's four grid ticks land on round
      // numbers -- 3, 4.5, 6, 7.5, 9 -- instead of 4.875 / 7.25 / 9.625.
      //
      // The mirrored bounds on #interest-input in index.html must match these.
      var EIR_MIN = 3.00, EIR_MAX = 9.00, EIR_DEFAULT = 4.50;

      $.each($elements, function (i, $element) {
          let rangerOptions = $(this).attr('data-piotnetforms-range-slider');
          if ($($element).siblings('.irs').length == 0) {
              var slider = $('#form-field-annual_interest').ionRangeSlider({
                  skin: "round",
                  type: "single",
                  grid: true,
                  step: 0.01,
                  min: EIR_MIN,
                  max: EIR_MAX,
                  from: EIR_DEFAULT,
                  postfix: "%",
                  onChange: function (data) {
                      // Mirror the slider into the text box, and keep the grey
                      // flat-rate line matching the rate being dragged.
                      //
                      // Deliberately does NOT call calculate(): the monthly
                      // instalment and totals only update when Calculate is
                      // clicked. The flat equivalent is not a result, it is the
                      // same rate said a different way, so it tracks live.
                      $('#interest-input').val(data.from);
                      updateFlatEquivalent();
                  }
              }).data("ionRangeSlider");

              // When text box value changes, update the slider (still no
              // recalc -- same reason as above).
              $('#interest-input').on('input', function () {
                  var inputVal = parseFloat($(this).val());
                  if (inputVal >= EIR_MIN && inputVal <= EIR_MAX) {
                      slider.update({ from: inputVal });
                      updateFlatEquivalent();
                  }
              });

              $($element).change();

              // Fill the flat-rate line in on first paint, so it never shows a
              // bare dash next to a slider that already has a value on it.
              updateFlatEquivalent();
          }
      });
  };

  $(window).on('elementor/frontend/init', function () {
      elementorFrontend.hooks.addAction('frontend/element_ready/piotnetforms-field.default', WidgetpiotnetformsFormBuilderHandlerRangeSliderannual_interest);
  });

  $(document).on('piotnet-widget-init-Piotnetforms_Field', '[data-piotnet-editor-widgets-item-root]', function(){
      WidgetpiotnetformsFormBuilderHandlerRangeSliderannual_interest($(this), $);
  });

  $(window).on('load', function(){
      WidgetpiotnetformsFormBuilderHandlerRangeSliderannual_interest($(document), $);
  });

}(jQuery)); 

(function() {
  if (typeof clearValidity === 'undefined') {
    function clearValidity(i) {
      jQuery(i).closest(".piotnetforms-field-subgroup").find(".piotnetforms-field-option input").each(function() {
        jQuery(this)[0].setCustomValidity("");
      });
    }
  }
})();


