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


function updateLoanAmount() {
	const carModel = document.getElementById('car-model').value;
	document.getElementById('hargakereta').value = "RM "+ carModel;
  const hargaKeretaSpan = document.getElementById('hargakereta');

  hargaKeretaSpan.textContent = `${parseFloat(carModel).toFixed(2)}`;

  document.getElementById('downpaymentval').value = 0;

console.log(document.getElementById('hargakereta').value)
console.log(document.getElementById('form-field-repayment_period').value)
getRangeSliderValue();
}
// Function to get the value of the range slider
function getRangeSliderValue() {
  var value = jQuery('#form-field-annual_interest').val();
  console.log('Annual Interest: ' + value);

  calculate();
}


function calculate() {
    const amount = parseRMToFloat(document.getElementById('hargakereta').value);
    const downpayment = (document.getElementById('downpaymentval').value);
    const loanAmount = amount - downpayment;
    console.log("amount : " +  loanAmount);
    console.log("cccsa : " +  downpayment);

    var value = jQuery('#form-field-annual_interest').val();

    const term = parseFloat(document.getElementById('form-field-repayment_period').value);
    const interest = value;
    console.log("Term : " +  term.toFixed(2));



    const totalInterest = (interest/100) * loanAmount *term;
    const monthly = (loanAmount+totalInterest) / (term*12);
 
    console.log("loanAmount : " +  loanAmount);
    console.log("interestd : " +  interest);

    const totalPaid = monthly * term*12;

    console.log("Monthly : " +  monthly.toFixed(2));
    console.log("Total :  "+ totalPaid.toFixed(2));
    console.log("Interest : " + totalInterest.toFixed(2));

    
    const formattedMonthly = "RM " + monthly.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const formattedTotal = "RM " + totalPaid.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const formattedInterest = "RM " + totalInterest.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    document.getElementById('monthval').textContent = formattedMonthly;
    document.getElementById('totalPaid').textContent = formattedTotal;
    document.getElementById('totalInterest').textContent = formattedInterest;
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

function CheckIfNoDownPayment()
{
    //calculate(); // TEMPORARILY DISABLE FURTHER NOTICE AHEAD 
}


function parseRMToFloat(rmString) {
  // Remove "Rm " from the string
  let cleanedString='';

  if(rmString!=null)
  {
    cleanedString = rmString.replace("RM", "");
  }
  else
  {
    return null;
  }
  // Parse the cleaned string to a float
  return parseFloat(cleanedString);
}

//For car calculation
const data = {
  "options": [
    {
      "label": "Honda City",
      "options": [
        {"label": "City 1.5L S", "value": "84900"},
        {"label": "City 1.5L E", "value": "89900"},
        {"label": "City 1.5L V", "value": "94900"},
        {"label": "City 1.5L RS", "value": "99900"},
        {"label": "City 1.5L e:HEV RS", "value": "111900"}
      ]
    },
    {
      "label": "Honda City Hatchback",
      "options": [
        {"label": "City Hatchback 1.5L S", "value": "85900"},
        {"label": "City Hatchback 1.5L E", "value": "90900"},
        {"label": "City Hatchback 1.5L V", "value": "95900"},
        {"label": "City Hatchback 1.5L RS", "value": "100900"},
        {"label": "City Hatchback 1.5L e:HEV RS", "value": "112900"}
      ]
    },
    {
      "label": "Honda WR-V",
      "options": [
        {"label": "WR-V 1.5L S", "value": "89900"},
        {"label": "WR-V 1.5L T E", "value": "95900"},
        {"label": "WR-V 1.5L T V", "value": "99900"},
        {"label": "WR-V 1.5L RS", "value": "107900"}
      ]
    },
    {
      "label": "Honda HR-V",
      "options": [
        {"label": "HR-V 1.5L S", "value": "115900"},
        {"label": "HR-V 1.5L T E", "value": "130900"},
        {"label": "HR-V 1.5L T V", "value": "135900"},
        {"label": "HR-V 1.5L e:HEV RS", "value": "141900"}
      ]
    },
    {
      "label": "Honda Civic",
      "options": [
        {"label": "Civic 1.5L E", "value": "131900"},
        {"label": "Civic 1.5L V", "value": "144900"},
        {"label": "Civic 1.5L RS", "value": "151900"},
        {"label": "Civic e:HEV 2.0L RS", "value": "167900"}
      ]
    },
    {
      "label": "Honda CR-V",
      "options": [
        {"label": "CR-V 1.5L S", "value": "159000"},
        {"label": "CR-V 1.5L T E", "value": "169900"},
        {"label": "CR-V 1.5L T V", "value": "181900"},
        {"label": "CR-V 2.0L e:HEV RS", "value": "195900"}
      ]
    },
    {
      "label": "Honda Civic Type-R",
      "options": [
        {"label": "Type R", "value": "399900"},
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
            'Length (mm)	4,580',
            'Width (mm)	1,748',
            'Height (mm)	1,467',
            'Wheelbase (mm)	2,600',
            'Tread Front (mm)	1,495',
            'Tread Rear (mm)	1,483',
            'Curb Weight (kg)	1,125',
            'Boot Capacity (Litre)	519'
          ],
          'Tyres' :[
            'Wheel Type : Alloy',
            'Wheel Size :	15',
            'Tyre Size	: 185/60R15',
            'Spare Tyre Size : 15'
          ],
          'Exterior' : [
             'Headlights	: Projector Halogen',
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
            'Remote Engine Start : -',
            'Walk Away Auto Lock : ✓',
            'Smart Entry with Push Start Button : ✓',
            'Paddle Shift : ✓',
            'Deceleration Selector Paddle	-',
            'Meter Cluster : 4.2” TFT Meter',
            'Air Conditioning	: Manual',
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
            'Rear USB Charger : -'
          ],
          'Audio':[
            'Audio System	Standard Audio ',
            'Apple CarPlay™ & Android Auto™ Connectivity* : - ',
            'USB Port	: 1',
            'Hands‑Free Telephone (HFT) : ✓',
            'Speakers	: 4',
            'Bluetooth	: ✓',
            'Tweeter	: -'
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
            'Reverse Camera	: -',
            'Honda LaneWatch Camera (LWC)	-',
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
          'Length (mm)	4,580',
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
          'Spare Tyre Size : 15'
        ],
        'Exterior' : [
           'Headlights	: Projector Halogen',
            'Auto Headlights : ✓',	
            'Daytime Running Lights	: LED',
            'Front Fog Lights : -',
            'Side Mirrors With Turning Lights : ✓',	
            'Outer Door Handle : Chrome',
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
          'Honda LaneWatch Camera (LWC)	-',
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
            'Length (mm)	4,580',
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
            'Spare Tyre Size : 15'
          ],
          'Exterior' : [
            'Headlights	: Projector Halogen',
              'Auto Headlights : ✓',	
              'Daytime Running Lights	: LED',
              'Front Fog Lights : -',
              'Side Mirrors With Turning Lights : ✓',	
              'Outer Door Handle : Chrome',
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
            'Honda LaneWatch Camera (LWC)	-',
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
          'Length (mm)	4,580',
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
          'Spare Tyre Size : 15'
        ],
        'Exterior' : [
          'Headlights	: Projector Halogen',
            'Auto Headlights : ✓',	
            'Daytime Running Lights	: LED',
            'Front Fog Lights : -',
            'Side Mirrors With Turning Lights : ✓',	
            'Outer Door Handle : Chrome',
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
          'Honda LaneWatch Camera (LWC)	-',
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
      'Variant 5': {
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
          'Length (mm)	4,580',
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
          'Tyre Size	: 185/60R16',
          'Spare Tyre Size : Temporary Repair Kit'
        ],
        'Exterior' : [
          'Headlights	: Projector Halogen',
            'Auto Headlights : ✓',	
            'Daytime Running Lights	: LED',
            'Front Fog Lights : LED',
            'Side Mirrors With Turning Lights : ✓',	
            'Outer Door Handle : Body Colour',
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
          'Rear USB Charger : 2'
        ],
        'Audio':[
          '8" Display Audio',
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
              'Electric Power Steering (EPS)',
          ],
          'Perfomance' :[
            '0-100 km/h in 10.7 seconds',
            'Maximum speed of 195 (km/h)',
            'Fuel consumption of 5.6 (L/100km)'
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
            'Length (mm)	4,350',
            'Width (mm)	1,748',
            'Height (mm)	1,488',
            'Wheelbase (mm)	2,600',
            'Tread Front (mm)	1,495',
            'Tread Rear (mm)	1,483',
            'Curb Weight (kg)	1,125',
            'Fuel Tank Capacity (litre) 40',
            'Boot Capacity (Litre)	519'
          ],
          'Tyres' :[
            'Wheel Type : Alloy',
            'Wheel Size :	15',
            'Tyre Size	: 185/60R15',
            'Spare Tyre Size : 15'
          ],
          'Exterior' : [
             'Headlights	: Projector Halogen',
              'Auto Headlights : ✓',	
              'Daytime Running Lights	: LED',
              'Front Fog Lights : -',
              'Side Mirrors With Turning Lights : ✓',	
              'Outer Door Handle : Body Colour',
              'Rear Combi Lights : LED',
              'Antenna	: Shark Fin'
          ],
          'Control & Interior' :[
            'Remote Engine Start : -',
            'Walk Away Auto Lock : ✓',
            'Smart Entry with Push Start Button : ✓',
            'Paddle Shift : ✓',
            'Deceleration Selector Paddle :	-',
            'ECON Button : ✓',
            'Meter Cluster : 4.2” TFT Meter',
            'Air Conditioning	: Manual',
            'Rear Air Conditioning Ventilation : -',
            'Steering Wheel :	Urethane',
            'Gear Knob Type	: Urethane',
            'Upholstery	: Fabric',
            'ULTRA Seat : ✓',
            'Steering Wheel Switch Audio Control : ✓',
            'Pedal Pad Type	: Normal',
            'Power Adjustable Door Mirror : ✓',
            'Power Retractable Door Mirror : ✓',
            'Centre Console with Armrest	: ✓',
            'Rear USB Charger : -'
          ],
          'Audio':[
            'Audio System	Standard Audio ',
            'Apple CarPlay™ & Android Auto™ Connectivity* : - ',
            'USB Port	: 1',
            'Hands‑Free Telephone (HFT) : ✓',
            'Speakers	: 4',
            'Bluetooth	: ✓',
            'Tweeter	: -'
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
            'Reverse Camera	: -',
            'Honda LaneWatch Camera (LWC)	-',
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
          'Engine & Perfomance': [
              '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
              '121 PS (119 hp) at 6,600 rpm, 145 Nm at 4,300 rpm',
              'Electronic Fuel Injection (PGM‑FI)',
              'Continuous Variable Transmission (CVT) with Econ mode',
              'Electric Power Steering (EPS)',
          ],
          'Perfomance' :[
            '0-100 km/h in 10.7 seconds',
            'Maximum speed of 195 (km/h)',
            'Fuel consumption of 5.6 (L/100km)'
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
            'Length (mm)	4,350',
            'Width (mm)	1,748',
            'Height (mm)	1,488',
            'Wheelbase (mm)	2,600',
            'Tread Front (mm)	1,495',
            'Tread Rear (mm)	1,483',
            'Curb Weight (kg)	1,125',
            'Fuel Tank Capacity (litre) 40',
            'Boot Capacity (Litre)	519'
          ],
          'Tyres' :[
            'Wheel Type : Alloy',
            'Wheel Size :	15',
            'Tyre Size	: 185/60R15',
            'Spare Tyre Size : 15'
          ],
          'Exterior' : [
            'Headlights	: Projector Halogen',
              'Auto Headlights : ✓',	
              'Daytime Running Lights	: LED',
              'Front Fog Lights : -',
              'Side Mirrors With Turning Lights : ✓',	
              'Outer Door Handle : Body Colour',
              'Rear Combi Lights : LED',
              'Antenna	: Shark Fin'
          ],
          'Control & Interior' :[
            'Remote Engine Start : ✓',
            'Walk Away Auto Lock : ✓',
            'Smart Entry with Push Start Button : ✓',
            'Paddle Shift : ✓',
            'Deceleration Selector Paddle :	-',
            'ECON Button : ✓',
            'Meter Cluster : 4.2” TFT Meter',
            'Air Conditioning	: Single Auto',
            'Rear Air Conditioning Ventilation : ✓',
            'Steering Wheel :	Urethane',
            'Gear Knob Type	: Urethane',
            'Upholstery	: Fabric',
            'ULTRA Seat : ✓',
            'Steering Wheel Switch Audio Control : ✓',
            'Pedal Pad Type	: Normal',
            'Power Adjustable Door Mirror : ✓',
            'Power Retractable Door Mirror : ✓',
            'Centre Console with Armrest	: ✓',
            'Rear USB Charger : 2'
          ],
          'Audio':[
            'Audio System	Standard Audio : 8” Display Audio',
            'Apple CarPlay™ & Android Auto™ Connectivity* : ✓ ',
            'USB Port	: 1',
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
            'Honda LaneWatch Camera (LWC)	-',
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
          'Engine & Perfomance': [
              '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
              '121 PS (119 hp) at 6,600 rpm, 145 Nm at 4,300 rpm',
              'Electronic Fuel Injection (PGM‑FI)',
              'Continuous Variable Transmission (CVT) with Econ mode',
              'Electric Power Steering (EPS)',
          ],
          'Perfomance' :[
            '0-100 km/h in 10.7 seconds',
            'Maximum speed of 195 (km/h)',
            'Fuel consumption of 5.6 (L/100km)'
          ],
          'Brake System': [
            'Front :	Ventilated Disc',
            'Rear :	Solid Disc',
            'Parking Brake :	Hand Brake Lever'
          ],
          'Suspension System':[
            'Front : MacPherson Strut',
            'Rear : Torsion Beam'
          ],
          'Dimension': [
            'Length (mm)	4,350',
            'Width (mm)	1,748',
            'Height (mm)	1,488',
            'Wheelbase (mm)	2,600',
            'Tread Front (mm)	1,495',
            'Tread Rear (mm)	1,483',
            'Curb Weight (kg)	1,125',
            'Fuel Tank Capacity (litre) 40',
            'Boot Capacity (Litre)	519'
          ],
          'Tyres' :[
            'Wheel Type : Alloy',
            'Wheel Size :	16',
            'Tyre Size	: 185/60R16',
            'Spare Tyre Size : 15'
          ],
          'Exterior' : [
            'Headlights	: LED',
              'Auto Headlights : ✓',	
              'Daytime Running Lights	: LED',
              'Front Fog Lights : LED',
              'Side Mirrors With Turning Lights : ✓',	
              'Outer Door Handle : Body Colour',
              'Rear Combi Lights : LED',
              'Antenna	: Shark Fin'
          ],
          'Control & Interior' :[
            'Remote Engine Start : ✓',
            'Walk Away Auto Lock : ✓',
            'Smart Entry with Push Start Button : ✓',
            'Paddle Shift : ✓',
            'Deceleration Selector Paddle :	-',
            'ECON Button : ✓',
            'Meter Cluster : 4.2” TFT Meter',
            'Air Conditioning	: Single Auto',
            'Rear Air Conditioning Ventilation : -',
            'Steering Wheel :	Leather^',
            'Gear Knob Type	: Leather^',
            'Upholstery	: Leather^',
            'ULTRA Seat : ✓',
            'Steering Wheel Switch Audio Control : ✓',
            'Pedal Pad Type	: Normal',
            'Power Adjustable Door Mirror : ✓',
            'Power Retractable Door Mirror : ✓',
            'Centre Console with Armrest	: ✓',
            'Rear USB Charger : 2'
          ],
          'Audio':[
            'Audio System	Standard Audio : 8” Display Audio',
            'Apple CarPlay™ & Android Auto™ Connectivity* : ✓ ',
            'USB Port	: 1',
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
            'Honda LaneWatch Camera (LWC) : ✓',
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
        'Engine & Perfomance': [
            '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
            '121 PS (119 hp) at 6,600 rpm, 145 Nm at 4,300 rpm',
            'Electronic Fuel Injection (PGM‑FI)',
            'Continuous Variable Transmission (CVT) with Econ mode',
            'Electric Power Steering (EPS)',
        ],
        'Perfomance' :[
          '0-100 km/h in 10.7 seconds',
          'Maximum speed of 195 (km/h)',
          'Fuel consumption of 5.6 (L/100km)'
        ],
        'Brake System': [
          'Front :	Ventilated Disc',
          'Rear :	Solid Disc',
          'Parking Brake :	Hand Brake Lever'
        ],
        'Suspension System':[
          'Front : MacPherson Strut',
          'Rear : Torsion Beam'
        ],
        'Dimension': [
          'Length (mm)	4,350',
          'Width (mm)	1,748',
          'Height (mm)	1,488',
          'Wheelbase (mm)	2,600',
          'Tread Front (mm)	1,495',
          'Tread Rear (mm)	1,483',
          'Curb Weight (kg)	1,125',
          'Fuel Tank Capacity (litre) 40',
          'Boot Capacity (Litre)	519'
        ],
        'Tyres' :[
          'Wheel Type : Alloy',
          'Wheel Size :	16',
          'Tyre Size	: 185/60R16',
          'Spare Tyre Size : 15'
        ],
        'Exterior' : [
           'Headlights	: LED',
            'Auto Headlights : ✓',	
            'Daytime Running Lights	: LED',
            'Front Fog Lights : LED',
            'Side Mirrors With Turning Lights : ✓',	
            'Outer Door Handle : Body Colour',
            'Rear Combi Lights : LED',
            'Antenna	: Shark Fin'
        ],
        'Control & Interior' :[
          'Remote Engine Start : ✓',
          'Walk Away Auto Lock : ✓',
          'Smart Entry with Push Start Button : ✓',
          'Paddle Shift : ✓',
          'Deceleration Selector Paddle :	-',
          'ECON Button : ✓',
          'Meter Cluster : 7” TFT Meter',
          'Air Conditioning	: Single Auto',
          'Rear Air Conditioning Ventilation : ✓',
          'Steering Wheel :	Leather^',
          'Gear Knob Type	: Leather^',
          'Upholstery	: Leather^',
          'ULTRA Seat : ✓',
          'Steering Wheel Switch Audio Control : ✓',
          'Pedal Pad Type	: Sport',
          'Power Adjustable Door Mirror : ✓',
          'Power Retractable Door Mirror : ✓',
          'Centre Console with Armrest	: ✓',
          'Rear USB Charger : 2'
        ],
        'Audio':[
          'Audio System	Standard Audio : 8” Display Audio',
          'Apple CarPlay™ & Android Auto™ Connectivity* : ✓ with wireless ',
          'USB Port	: 1',
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
          'Honda LaneWatch Camera (LWC) : ✓',
          'Forward Collision Warning (FCW)	: ✓',
          'Collision Mitigation Braking System (CMBS)	: ✓',
          'Lane Keep Assist System (LKAS)	: ✓',
          'Lane Departure Warning (LDW)	: ✓',
          'Road Departure Mitigation (RDM)	: ✓',
          'Adaptive Cruise Control (ACC)	: ✓',
          'Low Speed Follow (LSF)	: -',
          'Auto High Beam (AHB)	: ✓',
          'Lead Car Departure Notification (LCDN)	: ✓',
          'Honda CONNECT (Safety, Security, Convenience) : ✓',
          'Security Alarm with Immobiliser	: ✓'
        ]
  
        },
        'Variant 5': {
          'Engine & Perfomance': [
              '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
              '121 PS (119 hp) at 6,600 rpm, 145 Nm at 4,300 rpm',
              'Electronic Fuel Injection (PGM‑FI)',
              'Electric Continuous Variable Transmission (e‑CVT)',
              'Electric Power Steering (EPS)',
          ],
          'Perfomance' :[
            '0-100 km/h in 9.7 seconds',
            'Maximum speed of 177 (km/h)',
            'Fuel consumption of 3.7 (L/100km)'
          ],
          'Brake System': [
            'Front :	Ventilated Disc',
            'Rear :	Solid Disc',
            'Parking Brake :	Hand Brake Lever'
          ],
          'Suspension System':[
            'Front : MacPherson Strut',
            'Rear : Torsion Beam'
          ],
          'Dimension': [
            'Length (mm)	4,350',
            'Width (mm)	1,748',
            'Height (mm)	1,488',
            'Wheelbase (mm)	2,600',
            'Tread Front (mm)	1,495',
            'Tread Rear (mm)	1,483',
            'Curb Weight (kg)	1,125',
            'Fuel Tank Capacity (litre) 40',
            'Boot Capacity (Litre)	519'
          ],
          'Tyres' :[
            'Wheel Type : Alloy',
            'Wheel Size :	16',
            'Tyre Size	: 185/60R16',
            'Spare Tyre Size : 15'
          ],
          'Exterior' : [
            'Headlights	: LED',
              'Auto Headlights : ✓',	
              'Daytime Running Lights	: LED',
              'Front Fog Lights : LED',
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
            'Deceleration Selector Paddle :	✓',
            'ECON Button : ✓',
            'Meter Cluster : 7” TFT Meter',
            'Air Conditioning	: Single Auto',
            'Rear Air Conditioning Ventilation : ✓',
            'Steering Wheel :	Leather^',
            'Gear Knob Type	: Leather^',
            'Upholstery	: Leather^',
            'ULTRA Seat : ✓',
            'Steering Wheel Switch Audio Control : ✓',
            'Pedal Pad Type	: Sport',
            'Power Adjustable Door Mirror : ✓',
            'Power Retractable Door Mirror : ✓',
            'Centre Console with Armrest	: ✓',
            'Rear USB Charger : 2'
          ],
          'Audio':[
            'Audio System	Standard Audio : 8” Display Audio',
            'Apple CarPlay™ & Android Auto™ Connectivity* : ✓ with wireless ',
            'USB Port	: 1',
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
            'Auto Brake Hold (ABH)	: ✓',
            'Hill Start Assist (HSA)	: ✓',
            'Emergency Stop Signal (ESS)	: ✓',
            'Reverse Sensors	2',
            'Reverse Camera	: Multi-angle',
            'Honda LaneWatch Camera (LWC) : ✓',
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
          'Height (mm)	1,576',
          'Wheelbase (mm)	2,485',
          'Tread Front (mm)	1,540',
          'Tread Rear (mm)	1,540',
          'Curb Weight (kg)	1,108',
          'Ground Clearance (mm) 207',
          'Fuel Tank Capacity (litre) 40',
          'Boot Capacity (Litre)	380'
        ],
        'Tyres' :[
          'Wheel Type : Alloy',
          'Wheel Size :	16',
          'Tyre Size	: 215/60/R16',
          'Spare Tyre Size : 16'
        ],
        'Exterior' : [
           'Headlights	: Halogen',
            'Auto Headlights : -',	
            'Daytime Running Lights	: -',
            'Front Fog Lights : -',
            'Front LED Sequential Turn Signals : Bulb',
            'Side Mirrors With Turning Lights : ✓',	
            'Outer Door Handle : Body Colour',
            'Rear Combi Lights : LED',
            'Antenna	: Micro Pole'
        ],
        'Control & Interior' :[
          'Remote Engine Start : -',
          'Walk Away Auto Lock : -',
          'Smart Entry with Push Start Button : ✓',
          'Paddle Shift : -',
          'Cruise Control : -',
          'Meter Cluster : Analogue',
          'Air Conditioning	: Manual',
          'Air Conditioning Control	: Switch',
          'Steering Wheel :	Urethane',
          'Gear Knob Type	: Urethane',
          'Upholstery	: Fabric',
          'Rear Wiper System : ✓',
          'Steering Wheel Switch Audio Control : ✓',
          'Pedal Pad Type	: Normal',
          'Power Adjustable Door Mirror : ✓',
          'Power Retractable Door Mirror : ✓',
          'Centre Console with Armrest	: Fabric',
          'Rear Accessory Socket : 1'          
        ],
        'Audio':[
          'Audio System	Standard Audio : 7” Display Audio',
          'Apple CarPlay™ & Android Auto™ Connectivity* : ✓',
          'USB Port	: 2',
          'Hands‑Free Telephone (HFT) : ✓',
          'Speakers	: 2',
          'Bluetooth	: ✓'
        ],
        'Safety & Security':[
          'Dual Front SRS Airbags: ✓',
          'Side Airbags: ✓',
          'Side Curtain Airbags: -',
          'Driver Seatbelt Reminder: ✓',
          'Assistant Seatbelt Reminder: ✓',
          'Rear Seat Reminder: -',
          'ISOFIX I‑Size Type: ✓',
          'Auto Door Lock: ✓',
          'Vehicle Stability Assist (VSA): ✓',
          'Anti‑Lock Braking System (ABS): ✓',
          'Electronic Brake Distribution (EBD): ✓',
          'Hill Start Assist (HSA): ✓',
          'Emergency Stop Signal (ESS): ✓',
          'Reverse Sensors: 2',
          'Reverse Camera: -',
          'Honda LaneWatch Camera (LWC): ✓',
          'Honda SENSING (FCW, CMBS, LDW, LKAS, RDM, ACC, AHB, LCDN): -',
          'Forward Collision Warning (FCW): -',
          'Collision Mitigation Braking System (CMBS): -',
          'Lane Keep Assist System (LKAS): -',
          'Lane Departure Warning (LDW): -',
          'Road Departure Mitigation (RDM): -',
          'Adaptive Cruise Control (ACC): -',
          'Auto High Beam: -',
          'Lead Car Departure Notification: -',
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
          'Electronic Fuel Injection (PGM‑FI)',
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
        'Wheel Type : Alloy',
        'Wheel Size :	16',
        'Tyre Size	: 215/60/R16',
        'Spare Tyre Size : 16'
      ],
      'Exterior' : [
         'Headlights	: Halogen',
          'Auto Headlights :✓-',	
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
        'Rear Wiper System : ✓',
        'Steering Wheel Switch Audio Control : ✓',
        'Pedal Pad Type	: Normal',
        'Power Adjustable Door Mirror : ✓',
        'Power Retractable Door Mirror : ✓',
        'Centre Console with Armrest	: Fabric',
        'Rear Accessory Socket : 1'
      ],
      'Audio':[
        'Audio System	Standard Audio : 7” Display Audio',
        'Apple CarPlay™ & Android Auto™ Connectivity* : ✓',
        'USB Port	: 2',
        'Hands‑Free Telephone (HFT) : ✓',
        'Speakers	: 4',
        'Bluetooth	: ✓'
      ],
      'Safety & Security':[
        'Dual Front SRS Airbags: ✓',
        'Side Airbags: ✓',
        'Side Curtain Airbags: -',
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
          'Electronic Fuel Injection (PGM‑FI)',
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
        'Wheel Type : Alloy',
        'Wheel Size :	16',
        'Tyre Size	: 215/60/R16',
        'Spare Tyre Size : 16'
      ],
      'Exterior' : [
         'Headlights	: Halogen',
          'Auto Headlights :✓-',	
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
        'Rear Wiper System : ✓',
        'Steering Wheel Switch Audio Control : ✓',
        'Pedal Pad Type	: Normal',
        'Power Adjustable Door Mirror : ✓',
        'Power Retractable Door Mirror : ✓',
        'Centre Console with Armrest	: Leather',
        'Rear Accessory Socket : 1'
      ],
      'Audio':[
        'Audio System	Standard Audio : 7” Display Audio',
        'Apple CarPlay™ & Android Auto™ Connectivity* : ✓',
        'USB Port	: 2',
        'Hands‑Free Telephone (HFT) : ✓',
        'Speakers	: 4',
        'Bluetooth	: ✓'
      ],
      'Safety & Security':[
        'Dual Front SRS Airbags: ✓',
        'Side Airbags: ✓',
        'Side Curtain Airbags: -',
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
    'Variant 4': {
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
          '160 km/h Maximum speed',
          '11.3s of Accelaration of 0-100 km/h (secs)',
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
        'Wheel Type : Alloy',
        'Wheel Size :	17',
        'Tyre Size	: 215/55/R17',
        'Spare Tyre Size : 17'
      ],
      'Exterior' : [
         'Headlights	: Halogen',
          'Auto Headlights :✓-',	
          'Daytime Running Lights	: LED',
          'Front Fog Lights : LED',
          'Front LED Sequential Turn Signals : LED with Sequential',
          'Side Mirrors With Turning Lights : ✓',	
          'Outer Door Handle : Body Colour',
          'Rear Combi Lights : LED',
          'Antenna	: Shark Fin'
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
        'Rear Wiper System : ✓',
        'Steering Wheel Switch Audio Control : ✓',
        'Pedal Pad Type	: Normal',
        'Power Adjustable Door Mirror : ✓',
        'Power Retractable Door Mirror : ✓',
        'Centre Console with Armrest	: Leather',
        'Rear Accessory Socket : 1'
      ],
      'Audio':[
        'Audio System	Standard Audio : 7” Display Audio',
        'Apple CarPlay™ & Android Auto™ Connectivity* : ✓',
        'USB Port	: 2',
        'Hands‑Free Telephone (HFT) : ✓',
        'Speakers	: 6',
        'Bluetooth	: ✓'
      ],
      'Safety & Security':[
        'Dual Front SRS Airbags: ✓',
        'Side Airbags: ✓',
        'Side Curtain Airbags: ✓',
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
          '1.5 litre DOHC i-VTEC naturally-aspirated four-cylinder engine',
          '193 PS (142 hp) at 6,000 rpm, 243 Nm at 5,000 rpm',
          'Direct Fuel Injection (PGM‑FI)',
          'Continuous Variable Transmission (CVT)',
          'Electric Power Steering (EPS)',
          '2 Wheel Drive'
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
        'Curb Weight (kg)	1,598',
        'Fuel Tank Capacity (litre) 57',
        'Boot Capacity (Litre)	589'
      ],
      'Tyres' :[
        'Wheel Type : Alloy',
        'Wheel Size :	17"Silver',
        'Tyre Size	: 235/65R17',
        'Spare Tyre Size : 17'
      ],
      'Exterior' : [
        'Headlights	: LED',
          'Auto Headlights : ✓',	
          'Active Cornering Lights : -',
          'Daytime Running Lights	: LED',
          'Front Fog Lights : -',
          'Rear Fog Light : -',
          'Front LED Sequential Turn Signals ✓',
          'Side Mirrors With Turning Lights : Body Colour with LED Turn Light',	
          'Outer Door Handle : Body Colour',
          'Rear Combi Lights :  (LED)',
          'Antenna	: Shark Fin (Body Colour)',
          'Roof Rail : -',
          'Hands‑Free Power Tailgate With Walkaway Close : -',
          'Active Shutter Grille : -',
          'Tailpipe Chrome Finisher : -'
      ],
      'Control & Interior' :[
        'Remote Engine Start : ✓',
        'Walk Away Auto Lock : ✓',
        'Smart Entry with Push Start Button : ✓',
        'Key Card : -',
        'Head up Display : -',
        'Paddle Shift : -',
        'Deceleration Selector Paddle :	-',
        'Cruise Control : ✓',
        'ECON Button : ✓',
        'SPORT Button: - ',
        'Meter Cluster : 7” TFT Meter',
        'Air Conditioning	: Dual Auto',
        'Rear Air Conditioning Ventilation : ✓',
        'Auto Dim Rearview Mirror : -',
        'Steering Wheel :	Urethane',
        'Upholstery	: Fabric',
        '4‑Way Assistant Power Seat: -',
        '8‑Way Driver Power Seat : -',
        'Memory Seat : -',
        '2nd Row Sliding Seat : ✓',
        'Auto Front Wiper : -',
        'Rear Wiper System: ✓',
        'Pedal Pad Type	: Normal',
        'Power Adjustable Door Mirror : ✓',
        'Power Retractable Door Mirror : ✓',
        'Centre Console with Armrest	: ✓',
        'Auto Dim Rearview Mirror : ✓',
        'Front Roof Ambient Light : -',
        'Front Foot Ambient Light : -',
        'Cup Holder Light : -',
        'Front Door Inner Handle Light : -',
        'Front Door Inner Handle Line Illumination : -',
        'Wireless Charger (15W) : -',
        'Rear USB Charger : 2'
      ],
      'Audio':[
        'Audio System	Standard Audio : 7” Display Audio',
        'Apple CarPlay™ & Android Auto™ Connectivity* : ✓',
        'USB Port	: 1',
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
        'Front Sensors: -',
        'Reverse Sensors: 4',
        'Reverse Camera: Multi-angle',
        'Multi View Camera System (360 Camera): -',
        'Reverse Auto Tilt Mirror: -',
        'Honda LaneWatch Camera (LWC): -',
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
        'Tire Pressure Monitoring System (TPMS): -',
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
          '2 Wheel Drive'
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
          'Tailpipe Chrome Finisher : -'
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
        'Front Roof Ambient Light : -',
        'Front Foot Ambient Light : -',
        'Cup Holder Light : -',
        'Front Door Inner Handle Light : -',
        'Front Door Inner Handle Line Illumination : -',
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
        'Multi View Camera System (360 Camera): -',
        'Reverse Auto Tilt Mirror: -',
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
        'Tire Pressure Monitoring System (TPMS): -',
        'Security Alarm with Immobiliser: ✓'
      ]
    },
    'Variant 3': {
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
    'Variant 4': {
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
    'HondaCity5': 'Honda City',
    'CityHatchback1' : 'Honda City Hatchback',
    'CityHatchback2' : 'Honda City Hatchback',
    'CityHatchback3' : 'Honda City Hatchback',
    'CityHatchback4' : 'Honda City Hatchback',
    'CityHatchback5' : 'Honda City Hatchback',
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
    'Wrv4' : 'Honda WRV',
    'Crv1' : 'Honda CRV',
    'Crv2' : 'Honda CRV',
    'Crv3' : 'Honda CRV',
    'Crv4' : 'Honda CRV',
    'TyperR1'  : 'Honda RS',
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

  document.addEventListener('keydown', evt => {
    if (evt.key === 'Escape') {
  document.getElementById("myModalPromotion").style.display = "none";
    }
});
}

function closeModal() {
  document.getElementById("myModalPromotion").style.display = "none";


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

  document.addEventListener('keydown', evt => {
    if (evt.key === 'Escape') {
  document.getElementById("myModalInsurance").style.display = "none";
    }
});
}

function closeModal2() {
  document.getElementById("myModalInsurance").style.display = "none";


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
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex2 = slides.length}
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

