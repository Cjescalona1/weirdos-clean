const MAINNET_OR_TESTNET = 'mainnet'; // Either 'mainnet', 'testnet' or 'localhost
const MAINNET_CHAIN_ID = 1; // Mainnet
const TESTNET_CHAIN_ID = 4; // Rinkeby
const LOCALHSOT_CHAIN_ID = 31337; // Rinkeby

// Buttons
const connectBTN = document.getElementById('connectWallet');
const enlistBTN = document.getElementById('enlistBTN');

// HTML Text Elements
const walletText = document.getElementById('walletAddress');
const connectText = document.getElementById('connectText');
const missionName = document.getElementById('missionName');
const missionTimeline = document.getElementById('missionTimeLine');
const missionEntries = document.getElementById('walletEntries');
const enlistText = document.getElementById('enlistText');
const totalCats = document.getElementById('totalCats');
const totalEntries = document.getElementById('totalEnlisted');

const c1Entries_ = document.getElementById('c1Entries');
const c2Entries_ = document.getElementById('c2Entries');
const c3Entries_ = document.getElementById('c3Entries');
const c4Entries_ = document.getElementById('c4Entries');

const enlistStateText = document.getElementById('enlistStateText');
const lightIndicator = document.getElementById('indicatorLight');

const emptyCat = document.getElementById('MC_CAT_WRAP');

var missionName_;
var missionEntries_ = 0;
var clearanceLevels_ = 0;
var displayCats_ = 0;
//var baseUrl = 'https://cryptostickers.net/';
//var baseUrl = 'https://localhost:44372/';
var baseUrl = 'https://mutationapp.azurewebsites.net/';

var isMissionOpen = false;
var isConnected = false;
var isEnlisted = false;
var isEligible = false;

var connectedWallet;

$(document).ready(function () {
  $('#winGrid').hide();

  // Clear all the fields to default values.
  missionName.innerHTML = '';
  missionTimeline.innerHTML = '';
  totalEntries.innerHTML = '';
  totalEntries.innerHTML = '';
  //enlistStateText.innerHTML = '';

  // Hide this element and make a copy so that we 
  // can get to the empty cat later if we need to.
  $('#FC_CAT_WRAP').hide();
  var targetWrap = $('#FC_CAT_WRAP').clone(true, true).prop('id', 'FC_CAT_WRAP2');
  targetWrap.show();
  $('#FC_MODAL').append(targetWrap);
  ClearAndResetCatList();

  // Get mission data and populate table
  $.ajax({
    type: "POST",
    url: baseUrl + "CosmicCatsService.asmx/GetLatestMissionLite",
    contentType: "application/json",
    success: OnGetLatestMissionLite_
  });

    $.ajax({
    type: "POST",
    url: baseUrl + "CosmicCatsService.asmx/GetLatestMissionStatsLite",
    contentType: "application/json",
    success: OnGetLatestMissionStatsLite_
  });
});

//////////////////////////////
// AJAX HANDLERS
//////////////////////////////

function OnGetStarDustTotal_(data){
  var response = data.d;
  if (response.IsError == true) {
    ErrorToast(response.Message)
    isConnected = false;
  }
  else {
    var starDust = JSON.parse(response.RawObject)

      var starDustDisplayDiv = document.getElementById('divStarDust');

      starDustDisplayDiv.innerText = starDust;
  }
}

function OnGetLatestMissionLite_(data){
  var response = data.d;
  if (response.IsError == true) {
    ErrorToast(response.Message)
    isConnected = false;
  }
  else {
    var missionLite = JSON.parse(response.RawObject)
      missionName.innerHTML = missionLite.PrizeList;
      missionTimeline.innerHTML = missionLite.DateStart + " - " + missionLite.DateEnd;

      var img1 = document.getElementById('TM_IMG_1');
      var img2 = document.getElementById('TM_IMG_2');
      var img3 = document.getElementById('TM_IMG_3');

      img1.src = missionLite.SpecialTraits[0].Image;
      img1.setAttribute("srcset", "");
      img2.src = missionLite.SpecialTraits[1].Image;
      img2.setAttribute("srcset", "");
      img3.src = missionLite.SpecialTraits[2].Image;
      img3.setAttribute("srcset", "");

      var tm1 = document.getElementById('TM_1');
      var tm2 = document.getElementById('TM_2');
      var tm3 = document.getElementById('TM_3');

      tm1.innerHTML = missionLite.SpecialTraits[0].TraitName
      tm2.innerHTML = missionLite.SpecialTraits[1].TraitName
      tm3.innerHTML = missionLite.SpecialTraits[2].TraitName

      isMissionOpen = missionLite.IsOpen;
  }
}

function OnGetLatestMissionStatsLite_(data){
  var response = data.d;
  if (response.IsError == true) {
    ErrorToast(response.Message)
    isConnected = false;
  }
  else {
    var missionStatsLite = JSON.parse(response.RawObject)

      var total = document.getElementById('totalEnlisted');
      var c1 = document.getElementById('c1Entries');
      var c2 = document.getElementById('c2Entries');
      var c3 = document.getElementById('c3Entries');
      var c4 = document.getElementById('c4Entries');

      total.innerText = missionStatsLite.CrewsEnlisted;
      c1.innerText = missionStatsLite.ClearanceLevels[0].TotalCats;
      c2.innerText = missionStatsLite.ClearanceLevels[1].TotalCats;
      c3.innerText = missionStatsLite.ClearanceLevels[2].TotalCats;
      c4.innerText = missionStatsLite.ClearanceLevels[3].TotalCats;
  }
}

function OnGetFlightCrewLite_(data){
var response = data.d;
  if (response.IsError == true) {
    ErrorToast(response.Message)
    isConnected = false;
  }
  else {
      var cats_ = [];

      var flightCrewLite = JSON.parse(response.RawObject)

      var missionPoints = document.getElementById('MP_N');
      var totalCats = document.getElementById('TC_N');
      var wallet = document.getElementById('walletAddress');

      missionPoints.innerText = flightCrewLite.MissionPoints;
      totalCats.innerText = flightCrewLite.Cats.length;
      wallet.innerText = flightCrewLite.Address.slice(0, 6) + '...' + flightCrewLite.Address.toString().slice(flightCrewLite.Address.length - 6);

      if(flightCrewLite.DiscordName.length > 0)
      {
        var discordField = document.getElementById('discordEntry');
        discordField.value = flightCrewLite.DiscordName;
      }

      if (flightCrewLite.Cats.length > 0) {
        isEligible = true;
      }
      else {
        isEligible = false;
      }

      isEnlisted = flightCrewLite.IsEnlisted;

      ClearCatList();
      var catCount = 0;
      $.each(flightCrewLite.Cats, function (index4, cat) {
        var tempEmpty = $(emptyCat).clone(true, true).prop('id', 'cat'+index4);
        var tempEmptyImage = tempEmpty.find('#MC_CAT_IMG')
        var tempEmptyId = tempEmpty.find('#MC_CAT_NUMBER')
        var tempEmptyEntries = tempEmpty.find('#MC_CAT_ENTRIES')
        var tempEmptyEntiresWrapper = tempEmpty.find('#MC_CAT_ENTRIES_WRAP')

        tempEmptyImage.attr('srcset', cat.Image);
        tempEmptyId.text('#' + cat.CatId);
        tempEmptyEntries.text(cat.Points);
        tempEmptyEntiresWrapper.show(); 
        $('#FC_CAT_WRAP2').append(tempEmpty);
        catCount++;
      });

      while(catCount < 8)
      {
        var tempEmptyCat = $('#MC_CAT_WRAP').clone(true, true);
        tempEmptyCat.show();
        $('#FC_CAT_WRAP2').append(tempEmptyCat);
        catCount++;
      }

      isConnected = true;
      UpdateEnlistButtonState();
  }
}

function OnCheckMissionReadinessSucess_(data) {
  //console.log(data);
  var response = data.d;
  if (response.IsError == true) {
    ErrorToast(response.Message)
    isEnlisted = false;
  }
  else {
    var result = response.RawObject;
    isEnlisted = result.IsEnlisted;

    if(result.LastDiscordName.length > 0)
    {
      var discordField = document.getElementById('discordEntry');
      discordField.value = result.LastDiscordName;
    }
  }

  UpdateEnlistButtonState();
}

function OnEnlistSecureSuccess_(data) {
  var response = data.d;
  if (response.IsError == true) {
    isEnlisted = false;
    ErrorToast(response.Message)
  }
  else {
    isEnlisted = true;
    SuccessToast(response.Message)
  }

 var remoteData = JSON.stringify({
      "_address": connectedWallet,
    });

  $.ajax({
    type: "POST",
    data: remoteData,
    url: baseUrl + "CosmicCatsService.asmx/GetFlightCrewLite",
    contentType: "application/json",
    success: OnGetFlightCrewLite_
  });

  $.ajax({
    type: "POST",
    url: baseUrl + "CosmicCatsService.asmx/GetLatestMissionStatsLite",
    contentType: "application/json",
    success: OnGetLatestMissionStatsLite_
  });
}

function OnGetAllMissions_(data) {
  UpdateLatestMissionInfo(data);
}

// function OnGetAllMissionsAfterConnected_(data) {
//   UpdateLatestMissionInfo(data);

//   var remoteData = JSON.stringify({
//     "_address": connectedWallet,
//   });

//   $.ajax({
//     type: "POST",
//     data: remoteData,
//     url: baseUrl + "CosmicCatsService.asmx/LookupCatsByOwner",
//     contentType: "application/json",
//     success: OnLookupCatsByOwnerSuccess_
//   });

//   $.ajax({
//     type: "POST",
//     data: remoteData,
//     url: baseUrl + "CosmicCatsService.asmx/CheckMissionReadiness",
//     contentType: "application/json",
//     success: OnCheckMissionReadinessSucess_
//   });
// }

async function OnGetEnlistNonceSuccess_(data) {
  var response = data.d;
  if (response.IsError == true) {
    ErrorToast(response.Message)
  }
  else {
    var discordName = document.getElementById('discordEntry').value //prompt("Please enter your discord username (eg. user#0000): ");
    var nonce = response.RawObject;

    // Check that it matches the expected format of a discord username
    if (discordName.match(/^((.{2,32})#\d{4})/)) {
      var discordNameElement = document.getElementById("discordEntry");
      discordNameElement.classList.remove("red");

      let obj = {
        discordName: discordName,
        nonce: nonce,
        address: connectedWallet,
      }

      var message = JSON.stringify(obj, null, '  ');
      console.log('message: ' + message);

      //var signer = web3Provider.getSigner();
      //var sig = await signer.signMessage(message); // OLD WAY

      // This works for both Metamask and Coinbase wallet!
      var sig = await web3Provider.send('personal_sign', [message, connectedWallet]);

      console.log('signature: ' + sig);

      var remoteData = JSON.stringify({
        "_message": message,
        "_signature": sig,
      });

      $.ajax({
        type: "POST",
        data: remoteData,
        url: baseUrl + "CosmicCatsService.asmx/EnlistSecure",
        contentType: "application/json",
        success: OnEnlistSecureSuccess_
      });
    } else {
      var discordName = document.getElementById("discordEntry");
      discordName.classList.add("red");
      ErrorToast("Please Enter A Valid Discord ID.<br/> <b>Example:<b/> YourTag#1234")
    }
  }
}

// function OnLookupCatsByOwnerSuccess_(data) {
//   ResetCatIMG();
//   var cats_ = [];
//   var missionEntries_ = 0;

//   var response = data.d;
//   if (response.IsError == true) {
//     ErrorToast(response.Message)
//   }
//   else {
//     var mission = JSON.parse(response.RawObject)

//     $.each(mission.ClearanceLevels, function (index2, clearanceLevel) {
//       $.each(clearanceLevel.Entries, function (index3, entry) {
//         $.each(entry.Cats, function (index4, cat) {
//           missionEntries_ += cat.Entries;
//           displayCats_ += 1;
//           cats_.push(cat.Id);
//           if (cats_.length <= 8) {
//             document.getElementById('catIMG' + (cats_.length - 1)).src = cat.Image;
//           }
//         });
//       });

//       if (cats_.length > 0) {
//         isEligible = true;
//       }
//       else {
//         isEligible = false;
//       }
//       UpdateEnlistButtonState();
//     });

//     totalCats.innerHTML = cats_.length;
//     missionEntries.innerHTML = missionEntries_;
//   }
// }
//////////////////////////////
// AJAX HANDLERS
// END
//////////////////////////////

//////////////////////////////
// UTILITIES
//////////////////////////////
async function ConnectToWallet() {

  if (isConnected == true) {
    return;
  }

  if (typeof window.ethereum === 'undefined') {
    ErrorToast('No MetaMask or Web3 wallet installed.');
    return;
  }

  web3Provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await web3Provider.getNetwork();

  // Show an error if we aren't connected to the correct network.
  if (MAINNET_OR_TESTNET === 'mainnet') {
    if (network.chainId !== MAINNET_CHAIN_ID) {
      ErrorToast('Wallet is connected to another Ethereum network instead of mainnet.');
      return;
    }
  } else if (MAINNET_OR_TESTNET === 'testnet') {
    if (network.chainId === MAINNET_CHAIN_ID) {
      ErrorToast('Wallet is connected to mainnet, but this is the testnet app. To mint on the mainnet, please proceed to the mainnet app.');
      return;
    }
    if (network.chainId !== TESTNET_CHAIN_ID) {
      ErrorToast('Wallet is connected to wrong network. Testnet network should be rinkeby.');
      return;
    }
  }

  // Check the wallet
  try {
    await web3Provider.send("eth_requestAccounts", []);
    if (window.ethereum.isMetaMask) {
      window.ethereum.on('accountsChanged', (accounts) => {
        UpdateConnectedWalletAddress();
      });
      ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
      });
    }

    UpdateConnectedWalletAddress();
    isConnected = true;
    UpdateConnectButtonState();

  } catch (cause) {
    ErrorToast(cause.message);
    // throw new Error(cause.message, { cause });
  }
}

function ClearCatList()
{
  $('#FC_CAT_WRAP2').html('');
}

function ClearAndResetCatList()
{
  ClearCatList();

  ResetCatList();

  $('.mc_cat_pt_wrap').hide();
}

function ResetCatList()
{
  $('#FC_CAT_WRAP2').html('');

  for (let i = 0; i < 8; i++) {
    var tempEmptyCat = $('#MC_CAT_WRAP').clone(true, true).prop('id', 'emptycat' + i);
    tempEmptyCat.show();
    $('#FC_CAT_WRAP2').append(tempEmptyCat);
  }
}

function EnlistWallet() {
  if (isConnected == false) {
    ConnectToWallet();
    UpdateConnectButtonState();
  }
  else {
    if (isMissionOpen == false) {
      ErrorToast("No mission active, please check back later.");
      return;
    }

    // Get discord name from textbox
    // Get nonce from service
    // Created signing data object
    // - DiscordName: 
    // - Nonce: 
    // - Address: 
    // Sign object using current wallet
    // Pass signed object + signature to service to enlist
    // Get back results and update display. 

    var remoteData = JSON.stringify({
      "_address": connectedWallet,
    });

    $.ajax({
      type: "POST",
      data: remoteData,
      url: baseUrl + "CosmicCatsService.asmx/GetEnlistNonce",
      contentType: "application/json",
      success: OnGetEnlistNonceSuccess_
    });
  }
}

function ErrorToast(_message) {
  $.toast({
    text: _message,
    hideAfter: 15000,
    position: 'top-center',
    bgColor: '#ffa3c1',
    textColor: '#000000',
    loaderBg: '#FFF',
  })
}

// function ResetCatIMG() {
//   var _counter = 0;
//   while (_counter < 8) {
//     document.getElementById('catIMG' + _counter).src = "https://uploads-ssl.webflow.com/61faf0f1c6ddf71c0a898f82/621d151d1848a99578e843e5_CC_PlaceHolder2.jpg";
//     _counter++;
//   }
// }

function SuccessToast(_message) {
  $.toast({
    text: _message,
    hideAfter: 15000,
    position: 'top-center',
    bgColor: '#38ffb6',
    textColor: '#000000',
    loaderBg: '#FFF',
  })
}

function UpdateConnectButtonState() {
  if (isConnected == false) {
    connectText.innerHTML = "Connect To Mission Control";
  }
  else {
    connectText.innerHTML = "Connected To Mission Control";
  }
}

async function UpdateConnectedWalletAddress() {
  const myAddress = await web3Provider.getSigner().getAddress();
  connectedWallet = myAddress;
  walletText.innerText = myAddress.toString().slice(0, 6) + '...' + myAddress.toString().slice(myAddress.length - 6);
  connectText.innerText = "Connected To Mission Control";
  // Get Connected Wallet Info

    var remoteData = JSON.stringify({
      "_address": connectedWallet,
    });

  $.ajax({
    type: "POST",
    data: remoteData,
    url: baseUrl + "CosmicCatsService.asmx/GetFlightCrewLite",
    contentType: "application/json",
    success: OnGetFlightCrewLite_
  });

  $.ajax({
    type: "POST",
    data: remoteData,
    url: baseUrl + "CosmicCatsService.asmx/GetStarDustTotal",
    contentType: "application/json",
    success: OnGetStarDustTotal_
  });
}

function UpdateEnlistButtonState() {
  if (isMissionOpen == false) {
    enlistText.innerHTML = "No Active Mission";
    lightIndicator.classList.remove('yellow');
    lightIndicator.classList.add('green');
    enlistStateText.innerHTML = "Connected"

  }
  else {
    if (isConnected == true) {
      if (isEnlisted == true) {
        enlistText.innerHTML = "Refresh Enlistement";
        enlistStateText.innerHTML = "Enlisted"
        lightIndicator.classList.remove('yellow');
        lightIndicator.classList.add('green');
      }
      else {
        if (isEligible) {
          enlistText.innerHTML = "Enlist";
          enlistStateText.innerHTML = "Not Enlisted"
          lightIndicator.classList.remove('green');
          lightIndicator.classList.add('yellow');
        }
        else {
          enlistText.innerHTML = "Not Eligible";
          enlistStateText.innerHTML = "Not Eligible"
        }
      }
    }
    else {
      enlistText.innerHTML = "Connect";
      enlistStateText.innerHTML = "Not Connected"
    }
  }
}

function UpdateLatestMissionInfo(data) {
  // var winGrid = document.getElementById('winGrid');
  // winGrid.innerHTML = '';

  var response = data.d;
  if (response.IsError == true) {
    ErrorToast(response.Message)
  }
  else {
    var missions = JSON.parse(response.RawObject)

    $.each(missions, function (index, mi) {
      if (mi.isActive) {
        console.log(data);

        // Start Date
        var start = mi.StartDate;

        //End Date
        var end = mi.EndDate;
        // Set Text Elements

        var missionPrizes = '';
        $.each(mi.Prizes, function (index, p) {
          missionPrizes += p.Count + 'x ' + p.Name + ', ';
        });
        missionPrizes = missionPrizes.substring(0, missionPrizes.length -1);
        missionName.innerHTML = missionPrizes;

        missionTimeline.innerHTML = start + " - " + end;
        totalEntries.innerHTML = mi.TotalWallets;
        c1Entries_.innerHTML = mi.ClearanceLevels[0].TotalCats;
        c2Entries_.innerHTML = mi.ClearanceLevels[1].TotalCats;
        c3Entries_.innerHTML = mi.ClearanceLevels[2].TotalCats;
        c4Entries_.innerHTML = mi.ClearanceLevels[3].TotalCats;

        // isOpen can be stored as a global and then impact
        // what is shown on the button.
        if (mi.isOpen != true) {
          isMissionOpen = false;
        }
        else {
          isMissionOpen = true;
        }
        UpdateEnlistButtonState();

        var winnerOuter = document.getElementById('winnerOuter');
        winnerOuter.innerHTML = '';

        var sectionTw = document.createElement('div');
        sectionTw.classList.add('sectiontw');

        var sechSmall = document.createElement('div');
        sechSmall.classList.add('sech');
        sechSmall.classList.add('small');
        sectionTw.append(sechSmall);

        var csSpan = document.createElement('span');
        csSpan.classList.add('cs')
        csSpan.innerHTML = '//';
        sechSmall.append(csSpan);
        csSpan.after("  Mission Winners");

        $('#winnerOuter').append(sectionTw);


        $.each(mi.WinningCats, function (index2, c) {
          document.getElementById('winnerOuter').style.display = 'block';

          var targetId = "prizeHeader_" + c.PrizeName.split(" ").join("");
          var targetHeader = document.getElementById(targetId);
          if(targetHeader == null)
          {
            var tempContainer = document.createElement("div");
            tempContainer.style.paddingBottom= '35px';

            var tempHeader = document.createElement("div");
            tempHeader.classList.add("mc_piloth");
            tempHeader.classList.add("headerh");
            tempHeader.classList.add("botmarg");

            var csSpan = document.createElement('span');
            csSpan.classList.add('cs')
            csSpan.innerHTML = '//';
            tempHeader.append(csSpan);
            csSpan.after("  " + c.PrizeName);

            var tempSpan = document.createElement("span");
            tempContainer.append(tempHeader);

            var divWinGridTemp = $('#winGrid').clone(true, true).prop('id', targetId);
            divWinGridTemp.show();
            $(tempContainer).append(divWinGridTemp);
            $('#winnerOuter').append(tempContainer);
            targetHeader = $(divWinGridTemp);

            document.getElementById(targetId).style.display = 'grid';
            document.getElementById(targetId).style.setProperty('grid-row-gap', '25px');
            document.getElementById(targetId).style.setProperty('grid-column-gap', '25px');


          }

          var divNewEntry = document.createElement('div');
          divNewEntry.classList.add('winnerinnerwrap');

          var divEntries = document.createElement('div');
          divEntries.classList.add("fixedentries");
          divEntries.innerHTML = c.Entries;
          divNewEntry.append(divEntries);

          var divWinnerNumber = document.createElement('div');
          divWinnerNumber.classList.add('winnernumber');
          divWinnerNumber.innerText = index2 + 1 + '.';
          divNewEntry.append(divWinnerNumber);

          var imgImage = document.createElement("img");
          imgImage.setAttribute('src', c.Image);
          imgImage.setAttribute('loading', 'lazy');
          imgImage.classList.add("winnerimage");
          divNewEntry.append(imgImage);

          var divWinnerWallet = document.createElement('div');
          divWinnerWallet.classList.add('winnerwallet');
          divWinnerWallet.innerText = "0x..." + c.Address.slice(c.Address.length - 4);
          divNewEntry.append(divWinnerWallet);

          if (connectedWallet != null) {
            if (connectedWallet == c.Address) {
              divNewEntry.classList.add('connectedwinner');
            }
          }

          targetHeader.append(divNewEntry);
        });
      }
    });
  }
}
//////////////////////////////
// UTILITIES
// END
//////////////////////////////

//////////////////////////////
// EVENT HANDLERS
//////////////////////////////
connectBTN.addEventListener('click', () => {
  ConnectToWallet();
  UpdateConnectButtonState();
  UpdateEnlistButtonState();
});

enlistBTN.addEventListener('click', () => {
  EnlistWallet();
  UpdateEnlistButtonState();
});

$('input').on('keyup', function() {
  if (this.value.length > 1) {
    this.classList.remove("red");
  }
});


var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

//////////////////////////////
// EVENT HANDLERS
// END
//////////////////////////////

