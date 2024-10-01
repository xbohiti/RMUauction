const socket = io();
let standardItems = [];
let specialItems = [];
let highestBids = {};
let highestSpecialBids = {};
const ITEMS_PER_PAGE = window.innerWidth <= 768 ? 1 : 8;
let currentStandardPage = 1;
let currentSpecialPage = 1;
let currentUser = null;

// Simulated auction items (replace this with actual data from your server)
const standardAuctionItems = [
  {
    id: '1',
    name: 'Item #1',
    description: 'xBohiti - Spearit Bear Early Days EP Digital Album Download',
    blockchain: 'None',
    donor: 'xBohiti',
    value: '$10',
    startingBid: 1,
    startTime: new Date('2024-10-01T05:00:00Z'),
    endTime: new Date('2024-10-03T02:00:00Z'),
    image: 'https://i.postimg.cc/5tSgx3TJ/early-days-ep-cover.png',
    infoLink: 'https://xbohiti.bandcamp.com/album/spearit-bear-early-days-ep'
  },
  {
    id: '2',
    name: 'Item #2',
    description: 'Simba from Puppy Palace Rescue NFT',
    blockchain: 'Tezos',
    donor: 'Matthew L. Bonnstetter',
    value: '$3',
    startingBid: 1,
    startTime: new Date('2024-10-01T05:00:00Z'),
    endTime: new Date('2024-10-03T02:00:00Z'),
    image: 'https://i.postimg.cc/bYZkNspJ/image-2024-09-25-135859698.png',
    infoLink: 'https://objkt.com/tokens/KT1BJyLhwm6n4xxSnLY5qGvKViPdiYiHvzNt/4'
  },
  {
    id: '3',
    name: 'Item #3',
    description: 'Kimoji NFT #1361',
    blockchain: 'Polygon',
    donor: 'The Kimoji NFT',
    value: 'Starts at $1-$5',
    startingBid: 1,
    startTime: new Date('2024-10-01T05:00:00Z'),
    endTime: new Date('2024-10-03T02:00:00Z'),
    image: 'https://i.postimg.cc/s2sCg0SV/kim1.png',
    infoLink: 'https://thekimoji.xyz'
  },
  {
    id: '4',
    name: 'Item #4',
    description: 'Kimoji NFT #1372',
    blockchain: 'Polygon',
    donor: 'The Kimoji NFT',
    value: 'Starts at $1-$5',
    startingBid: 1,
    startTime: new Date('2024-10-01T05:00:00Z'),
    endTime: new Date('2024-10-03T02:00:00Z'),
    image: 'https://i.postimg.cc/XNmMCvF1/kim5.png',
    infoLink: 'https://thekimoji.xyz'
  },
  {
    id: '5',
    name: 'Item #5',
    description: 'Kimoji NFT #1386',
    blockchain: 'Polygon',
    donor: 'The Kimoji NFT',
    value: 'Starts at $1-$5',
    startingBid: 1,
    startTime: new Date('2024-10-01T05:00:00Z'),
    endTime: new Date('2024-10-03T02:00:00Z'),
    image: 'https://i.postimg.cc/NfH37wks/kim6.png',
    infoLink: 'https://thekimoji.xyz'
  },
  {
    id: '6',
    name: 'Item #6',
    description: 'Kimoji NFT #1650',
    blockchain: 'Polygon',
    donor: 'The Kimoji NFT',
    value: 'Starts at $1-$5',
    startingBid: 1,
    startTime: new Date('2024-10-01T05:00:00Z'),
    endTime: new Date('2024-10-03T02:00:00Z'),
    image: 'https://i.postimg.cc/Bbdd9h4f/kim8.png',
    infoLink: 'https://thekimoji.xyz'
  },
  {
    id: '7',
    name: 'Item #7',
    description: 'Kimoji NFT #1654',
    blockchain: 'Polygon',
    donor: 'The Kimoji NFT',
    value: 'Starts at $1-$5',
    startingBid: 1,
    startTime: new Date('2024-10-01T05:00:00Z'),
    endTime: new Date('2024-10-03T02:00:00Z'),
    image: 'https://i.postimg.cc/RZ12yQY2/kim9.png',
    infoLink: 'https://thekimoji.xyz'
  },
  {
    id: '8',
    name: 'Item #8',
    description: 'Kimoji NFT #1729',
    blockchain: 'Polygon',
    donor: 'The Kimoji NFT',
    value: 'Starts at $1-$5',
    startingBid: 1,
    startTime: new Date('2024-10-01T05:00:00Z'),
    endTime: new Date('2024-10-03T02:00:00Z'),
    image: 'https://i.postimg.cc/Rh3jYrrT/kim3.png',
    infoLink: 'https://thekimoji.xyz'
  },
  {
    id: '9',
    name: 'Item #9',
    description: 'Crypto Duketz NFT #752',
    blockchain: 'Solana',
    donor: 'Crypto Duketz',
    value: 'Starts at $5-$15',
    startingBid: 5,
    startTime: new Date('2024-10-01T05:00:00Z'),
    endTime: new Date('2024-10-03T02:00:00Z'),
    image: 'https://pvzs7b2ogynqbnbployh7q5xkvwz6ja7hsxslnhy6nhkx4he23ka.arweave.net/fXMvh042GwC0L1uwf8O3VW2fJB88ryW0-PNOq_Dk1tQ?ext=png',
    infoLink: 'https://cryptoduketz.io'
  },
  {
    id: '10',
    name: 'Item #10',
    description: 'Crypto Duketz NFT #4006',
    blockchain: 'Solana',
    donor: 'Crypto Duketz',
    value: 'Starts at $5-$15',
    startingBid: 5,
    startTime: new Date('2024-10-01T05:00:00Z'),
    endTime: new Date('2024-10-03T02:00:00Z'),
    image: 'https://xebw3gn6eiarifi7yupvlire3vlntgcpriuevjxeqiwpaanyvmma.arweave.net/uQNtmb4iARQVH8UfVaIk3VbZmE-KKEqm5IIs8AG4qxg?ext=png',
    infoLink: 'https://cryptoduketz.io'
  }
  // ... other standard items ...
];

const specialAuctionItems = [
  {
    id: 'S1',
    name: 'Special Item #1',
    description: 'xBohiti Special #1 - Habichuelas Guisadas',
    blockchain: 'Polygon',
    donor: 'The Phygital Food Project',
    value: 'Not Enough Data',
    startingBid: 10,
    startTime: new Date('2024-10-01T05:00:00Z'),
    endTime: new Date('2024-10-03T02:00:00Z'),
    image: 'https://i.postimg.cc/gkV5mrjg/xbohiti-special-1-min.png',
    infoLink: 'https://www.phygitalfood.org/nfts/xbohiti-special'
  },
  {
    id: 'S2',
    name: 'Special Item #2',
    description: 'Phygital Food NFT #2 - Banana',
    blockchain: 'Polygon',
    donor: 'The Phygital Food Project',
    value: 'Not Enough Data',
    startingBid: 10,
    startTime: new Date('2024-10-01T05:00:00Z'),
    endTime: new Date('2024-10-03T02:00:00Z'),
    image: 'https://i.postimg.cc/85K6ZPvN/banana.png',
    infoLink: 'https://www.phygitalfood.org/nfts/phygitalfoodnft'
  },
  {
    id: 'S3',
    name: 'Special Item #3',
    description: 'Dead y00t #2165',
    blockchain: 'Solana',
    donor: 'Dead Y00ts',
    value: 'Starts at $30',
    startingBid: 20,
    startTime: new Date('2024-10-01T05:00:00Z'),
    endTime: new Date('2024-10-03T02:00:00Z'),
    image: 'https://lh3.googleusercontent.com/N8J-rFdScsl_0ZKWd1TLdjS9Tr9H0VRahzp13q1uMWrdjFpXVyxWIX437hstduf_TLMb0r61G8Tc3NFJ0EG6JbQBUDvUW0uDQbM',
    infoLink: 'https://magiceden.io/item-details/AcWZdXPL8ZNAyJFHKrC7uYtKYqC4hC4p127SqFmmmTsL'
  },
  {
    id: 'S4',
    name: 'Special Item #4',
    description: 'MetaRides - UD Vehicle #481 NFT',
    blockchain: 'Polygon',
    donor: 'MetaRides',
    value: 'Starts at $50-$400',
    startingBid: 50,
    startTime: new Date('2024-10-01T05:00:00Z'),
    endTime: new Date('2024-10-03T02:00:00Z'),
    image: 'https://i.seadn.io/s/raw/files/5a5597b79d6c0473685bc6bc6833726a.png?auto=format&dpr=1&w=1000',
    infoLink: 'https://opensea.io/collection/metarides-vehicle'
  },
  {
    id: 'S5',
    name: 'Special Item #5',
    description: 'Sabet Mystery NFT #2',
    blockchain: 'Unknown',
    donor: 'Sabet',
    value: 'Starts at $200-$1000',
    startingBid: 100,
    startTime: new Date('2024-10-01T05:00:00Z'),
    endTime: new Date('2024-10-03T02:00:00Z'),
    image: 'https://i.postimg.cc/PfzZLCBT/sabet.jpg',
    infoLink: 'https://www.sabet.art'
  },
  // ... other special items ...
];

function displayItems() {
  displayStandardItems();
  displaySpecialItems();
}

function displayStandardItems() {
  const startIndex = (currentStandardPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const itemsToDisplay = standardItems.slice(startIndex, endIndex);
  const itemsContainer = document.getElementById('standard-items-container');
  if (!itemsContainer) {
    console.error("Standard items container not found");
    return;
  }
  itemsContainer.innerHTML = '';
  itemsToDisplay.forEach(item => {
    const itemElement = createItemElement(item, false);
    itemsContainer.appendChild(itemElement);
    updateHighestBidDisplay(item.id, false);
    startTimer(item.id, new Date(item.startTime), new Date(item.endTime));
  });
  updatePaginationControls('standard', standardItems.length);
}

function displaySpecialItems() {
  const startIndex = (currentSpecialPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const itemsToDisplay = specialItems.slice(startIndex, endIndex);
  const itemsContainer = document.getElementById('special-items-container');
  if (!itemsContainer) {
    console.error("Special items container not found");
    return;
  }
  itemsContainer.innerHTML = '';
  itemsToDisplay.forEach(item => {
    const itemElement = createItemElement(item, true);
    itemsContainer.appendChild(itemElement);
    updateHighestBidDisplay(item.id, true);
    startTimer(item.id, new Date(item.startTime), new Date(item.endTime));
  });
  updatePaginationControls('special', specialItems.length);
}

function createItemElement(item, isSpecial) {
  const itemElement = document.createElement('div');
  itemElement.className = 'auction-item';
  itemElement.setAttribute('data-item-id', item.id);

  const bidsObject = isSpecial ? highestSpecialBids : highestBids;
  const highestBid = bidsObject[item.id];
  const highestBidDisplay = highestBid ? `$${highestBid.bid} by ${highestBid.username}` : 'No bids yet';

  const now = new Date();
  const isBiddingAllowed = now >= item.startTime && now < item.endTime;

  itemElement.innerHTML = `
    <h3>${item.name}</h3>
    <div class="image-container">
      <img src="${item.image}" alt="${item.name}">
    </div>
    <p>${item.description}</p>
    <p class="blockchain">Blockchain: ${item.blockchain}</p>
    <p class="donor">Donated by: ${item.donor}</p>
    <p class="value">Value: ${item.value}</p>
    <p>Starting Bid: $${item.startingBid}</p>
    <p class="highest">Highest Bid: <span id="highest-bid-${item.id}">${highestBidDisplay}</span></p>
    <p class="bidding"><span id="timer-label-${item.id}"></span> <span id="timer-${item.id}"></span></p>
    <div class="progress-bar-container">
      <div class="progress-bar" id="progress-bar-${item.id}"></div>
    </div>
    <input type="number" id="bid-input-${item.id}" min="${(highestBid?.bid || item.startingBid) + 1}" placeholder="Enter a bid amount" ${isBiddingAllowed ? '' : 'disabled'}>
    <button id="bid-button-${item.id}" ${isBiddingAllowed ? '' : 'disabled'}>Place Bid</button>
    <a href="${item.infoLink}" class="info-button" target="_blank">Info About This Item</a>
  `;

  itemElement.querySelector(`#bid-button-${item.id}`).addEventListener('click', () => placeBid(item.id, isSpecial));

  itemElement.addEventListener('mouseenter', () => {
    itemElement.style.transform = 'scale(1.05)';
    itemElement.style.transition = 'transform 0.3s ease';
  });
  itemElement.addEventListener('mouseleave', () => {
    itemElement.style.transform = 'scale(1)';
  });

  return itemElement;
}

function updatePaginationControls(type, totalItems) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginationElement = document.getElementById(`${type}-pagination`);
  const currentPage = type === 'standard' ? currentStandardPage : currentSpecialPage;

  if (!paginationElement) {
    console.error(`${type} pagination element not found`);
    return;
  }

  paginationElement.innerHTML = `
    <button id="${type}-prev-page">Previous</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button id="${type}-next-page">Next</button>
  `;

  const prevButton = document.getElementById(`${type}-prev-page`);
  const nextButton = document.getElementById(`${type}-next-page`);

  if (prevButton) prevButton.addEventListener('click', () => changePage(type, -1));
  if (nextButton) nextButton.addEventListener('click', () => changePage(type, 1));

  if (prevButton) prevButton.disabled = (currentPage === 1);
  if (nextButton) nextButton.disabled = (currentPage === totalPages);
}

function changePage(type, delta) {
  const items = type === 'standard' ? standardItems : specialItems;
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  if (type === 'standard') {
    currentStandardPage = Math.max(1, Math.min(currentStandardPage + delta, totalPages));
  } else {
    currentSpecialPage = Math.max(1, Math.min(currentSpecialPage + delta, totalPages));
  }

  displayItems();
}

function registerUser(event) {
  event.preventDefault();
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const name = document.getElementById('register-name').value;

  socket.emit('register', { username, email, password, name }, (response) => {
    if (response.success) {
      alert('Registration successful! Please login to place bids.');
      document.getElementById('registration-form').reset();
    } else {
      alert(response.message || 'Registration failed. Please try again.');
    }
  });
}

function loginUser(event) {
  event.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  socket.emit('login', { username, password }, (response) => {
    if (response.success) {
      currentUser = username;
      alert(`Welcome, ${username}! You can now place bids.`);
      updateUIForLoggedInUser();
    } else {
      alert(response.message || 'Login failed. Please try again.');
    }
  });
}
function updateUIForLoggedInUser() {
  document.getElementById('registration-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'none';
  const logoutButton = document.createElement('button');
  logoutButton.textContent = 'Logout';
  logoutButton.onclick = logout;
  document.querySelector('header').appendChild(logoutButton);
}

function logout() {
  currentUser = null;
  location.reload();
}

function placeBid(itemId, isSpecial) {
  if (!currentUser) {
      alert('Please login to place a bid.');
      return;
  }

  const bidInput = document.getElementById(`bid-input-${itemId}`);
  const bidValue = parseFloat(bidInput.value);
  const bidsObject = isSpecial ? highestSpecialBids : highestBids;
  const currentHighestBid = bidsObject[itemId]?.bid || (isSpecial ? specialItems : standardItems).find(i => i.id === itemId).startingBid;

  if (bidValue > currentHighestBid) {
      socket.emit('bid', { itemId, bid: bidValue, username: currentUser, isSpecial });
      // The display will be updated when the server confirms the bid
  } else {
      showBidFeedback(itemId, 'Please enter a higher bid.', 'error');
  }
}

function showBidFeedback(itemId, message, type) {
  const feedbackElement = document.createElement('div');
  feedbackElement.textContent = message;
  feedbackElement.className = `bid-feedback ${type}`;
  const itemElement = document.querySelector(`.auction-item[data-item-id="${itemId}"]`);
  itemElement.appendChild(feedbackElement);
  setTimeout(() => {
    feedbackElement.remove();
  }, 3000);
}

function updateHighestBid(itemId, bid, username, isSpecial) {
  const bidElement = document.getElementById(`highest-bid-${itemId}`);
  if (bidElement) {
      bidElement.textContent = `$${bid} by ${username}`;
      bidElement.classList.add('new-highest-bid');
      setTimeout(() => bidElement.classList.remove('new-highest-bid'), 3000);
  }
  const bidInput = document.getElementById(`bid-input-${itemId}`);
  if (bidInput) {
      bidInput.min = bid + 1;
  }
}

function updateHighestBidDisplay(itemId, isSpecial) {
  const bidElement = document.getElementById(`highest-bid-${itemId}`);
  if (bidElement) {
    const bidsObject = isSpecial ? highestSpecialBids : highestBids;
    const highestBid = bidsObject[itemId];
    bidElement.textContent = highestBid ? `$${highestBid.bid} by ${highestBid.username}` : 'No bids yet';
  }
}

function startTimer(itemId, startTime, endTime) {
  const timerElement = document.getElementById(`timer-${itemId}`);
  const timerLabelElement = document.getElementById(`timer-label-${itemId}`);
  const progressBar = document.getElementById(`progress-bar-${itemId}`);

  function updateTimer() {
    const currentTime = new Date();
    if (currentTime < startTime) {
      const timeToStart = startTime - currentTime;
      const days = Math.floor(timeToStart / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeToStart % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeToStart % (1000 * 60)) / 1000);

      timerLabelElement.textContent = "Bidding Starts In:";
      timerElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      progressBar.style.width = '0%';
      setTimeout(updateTimer, 1000);
    } else if (currentTime < endTime) {
      const timeLeft = endTime - currentTime;
      const totalDuration = endTime - startTime;
      const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      timerLabelElement.textContent = "Time Remaining:";
      timerElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      progressBar.style.width = `${progress}%`;
      setTimeout(updateTimer, 1000);
    } else {
      timerLabelElement.textContent = "Auction Status:";
      timerElement.textContent = 'Auction Ended';
      progressBar.style.width = '100%';
      displayWinner(itemId);
    }
  }

  updateTimer();
}

function displayWinner(itemId) {
  const winnerElement = document.getElementById(`highest-bid-${itemId}`);
  const bidButton = document.getElementById(`bid-button-${itemId}`);
  const bidInput = document.getElementById(`bid-input-${itemId}`);

  if (highestBids[itemId]) {
    winnerElement.textContent = `Winner: ${highestBids[itemId].username} with $${highestBids[itemId].bid}`;
    winnerElement.classList.add('winner-announcement');
    showGavelAnimation(itemId);
  } else {
    winnerElement.textContent = 'No bids were placed';
    winnerElement.classList.add('no-winner');
  }

  if (bidButton) bidButton.disabled = true;
  if (bidInput) bidInput.disabled = true;
}

function showGavelAnimation(itemId) {
  const itemElement = document.querySelector(`.auction-item[data-item-id="${itemId}"]`);
  const gavel = document.createElement('div');
  gavel.className = 'gavel-animation';
  gavel.innerHTML = '🔨';
  itemElement.appendChild(gavel);

  gavel.animate([
    { transform: 'rotate(0deg) translateY(0px)' },
    { transform: 'rotate(-45deg) translateY(-20px)' },
    { transform: 'rotate(0deg) translateY(0px)' }
  ], {
    duration: 500,
    iterations: 3
  });

  setTimeout(() => gavel.remove(), 1500);
}

const sponsors = [
  { image: 'https://i.postimg.cc/28jrpwhz/Screenshot-2024-10-01-013341.png', link: 'https://vtatv.net' },
  { image: 'https://i.postimg.cc/qRNMj2TD/event-sponsor.png', link: 'https://www.rmu.foundation/events/contribute/sponsors' },
  { image: 'https://i.postimg.cc/qRNMj2TD/event-sponsor.png', link: 'https://www.rmu.foundation/events/contribute/sponsors' },
  { image: 'https://i.postimg.cc/qRNMj2TD/event-sponsor.png', link: 'https://www.rmu.foundation/events/contribute/sponsors' },
  { image: 'https://i.postimg.cc/qRNMj2TD/event-sponsor.png', link: 'https://www.rmu.foundation/events/contribute/sponsors' },
// Add more sponsors as needed
];

function displaySponsors() {
  const sponsorsContainer = document.getElementById('sponsors-container');
  sponsors.forEach(sponsor => {
    const sponsorElement = document.createElement('a');
    sponsorElement.href = sponsor.link;
    sponsorElement.target = '_blank';
    sponsorElement.className = 'sponsor-item';
    
    const imgElement = document.createElement('img');
    imgElement.src = sponsor.image;
    imgElement.alt = 'Sponsor';
    
    sponsorElement.appendChild(imgElement);
    sponsorsContainer.appendChild(sponsorElement);
  });
}

// Call this function when the page loads
window.addEventListener('load', displaySponsors);

// Dark mode toggle
const darkModeToggle = document.createElement('button');
darkModeToggle.id = 'dark-mode-toggle';
darkModeToggle.textContent = '🌓';
darkModeToggle.addEventListener('click', toggleDarkMode);
document.querySelector('header').appendChild(darkModeToggle);

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

// Sticky header
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 100) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('registration-form').addEventListener('submit', registerUser);
  document.getElementById('login-form').addEventListener('submit', loginUser);
  standardItems = standardAuctionItems;
  specialItems = specialAuctionItems;
  displayItems();

  // Add hover animations to auction items
  document.querySelectorAll('.auction-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'scale(1.05)';
      item.style.transition = 'transform 0.3s ease';
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'scale(1)';
    });
  });
});

socket.on('bidUpdate', (data) => {
  const { itemId, bid, username, isSpecial } = data;
  const bidsObject = isSpecial ? highestSpecialBids : highestBids;
  if (!bidsObject[itemId] || bid > bidsObject[itemId].bid) {
      bidsObject[itemId] = { bid, username };
      updateHighestBid(itemId, bid, username, isSpecial);
      showBidFeedback(itemId, 'New highest bid!', 'success');
  }
});

socket.on('items', (data) => {
  standardItems = data.standard;
  specialItems = data.special;
  // Update highest bids
  data.standardHighestBids.forEach(bid => {
    highestBids[bid._id] = { bid: bid.bid, username: bid.username };
  });
  data.specialHighestBids.forEach(bid => {
    highestSpecialBids[bid._id] = { bid: bid.bid, username: bid.username };
  });
  displayItems();
});

socket.on('allBids', (allBids) => {
  allBids.standard.forEach(bid => {
    const { _id: itemId, bid: bidAmount, username } = bid;
    highestBids[itemId] = { bid: bidAmount, username };
  });
  allBids.special.forEach(bid => {
    const { _id: itemId, bid: bidAmount, username } = bid;
    highestSpecialBids[itemId] = { bid: bidAmount, username };
  });
  displayItems();
});

// Request all bids when the page loads
socket.emit('fetchAllBids');

