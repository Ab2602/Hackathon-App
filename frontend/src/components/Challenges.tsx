import { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "../assets/styles/challenges.css";

interface Challenge {
  id: number;
  challengeName: string;
  startDate: string;
  endDate: string;
  description: string;
  level: string;
  image: string;
}

const Challenges = () => {
  const [cardsData, setCardsData] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timers, setTimers] = useState<{ [key: number]: { days: number, hours: number, minutes: number } }>({});
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [levelFilter, setLevelFilter] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Add search state
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(''); // Add debounced search state
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Debounce the search term to prevent triggering search for every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 100); // 500ms delay for debounce

    // Cleanup the timeout when the component unmounts or when searchTerm changes
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch challenges based on the debounced search term
  useEffect(() => {
    fetch("http://localhost:3001/api/challenges")
      .then((response) => response.json())
      .then((data: Challenge[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const filteredData = data.filter(challenge =>
            challenge.challengeName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          );
          setCardsData(filteredData);
          initializeTimers(filteredData);
        } else {
          setCardsData([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setCardsData([]);
        setIsLoading(false);
      });
  }, [debouncedSearchTerm]);

  const initializeTimers = (challenges: Challenge[]) => {
    const updatedTimers: { [key: number]: { days: number, hours: number, minutes: number } } = {};

    challenges.forEach((challenge) => {
      const status = getStatus(challenge.startDate, challenge.endDate);
      if (status === "Upcoming") {
        updatedTimers[challenge.id] = calculateTimeUntilStart(challenge.startDate);
      } else if (status === "Active") {
        updatedTimers[challenge.id] = calculateTimeRemaining(challenge.endDate);
      }
    });

    setTimers(updatedTimers);

    const interval = setInterval(() => {
      const newTimers = { ...timers };
      challenges.forEach((challenge) => {
        const status = getStatus(challenge.startDate, challenge.endDate);
        if (status === "Upcoming") {
          newTimers[challenge.id] = calculateTimeUntilStart(challenge.startDate);
        } else if (status === "Active") {
          newTimers[challenge.id] = calculateTimeRemaining(challenge.endDate);
        }
      });
      setTimers(newTimers);
    }, 500);

    return () => clearInterval(interval);
  };

  const calculateTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const difference = end.getTime() - now.getTime();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes };
  };

  const calculateTimeUntilStart = (startDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const difference = start.getTime() - now.getTime();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes };
  };

  const getStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const startDateParsed = new Date(startDate);
    const endDateParsed = new Date(endDate);

    if (isNaN(startDateParsed.getTime()) || isNaN(endDateParsed.getTime())) {
      return "Invalid Date";
    }

    if (now < startDateParsed) {
      return "Upcoming";
    } else if (now >= startDateParsed && now <= endDateParsed) {
      return "Active";
    } else {
      return "Past";
    }
  };

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  const handleStatusChange = (status: string) => {
    setStatusFilter(prev =>
      status === 'All' ? [] : 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleLevelChange = (level: string) => {
    setLevelFilter(prev =>
      level === 'All' ? [] :
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const filteredChallenges = cardsData.filter(challenge => {
    const status = getStatus(challenge.startDate, challenge.endDate);
    const statusMatch = statusFilter.length === 0 || statusFilter.includes(status);
    const levelMatch = levelFilter.length === 0 || levelFilter.includes(challenge.level);
    return statusMatch && levelMatch;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="explore">
        <h3>Explore Challenges</h3>
        <div className="search-filter">
          <input
            type="search"
            name="search-form"
            id="search-form"
            className="search-input"
            placeholder="Search"
            value={searchTerm} // Bind the search input
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on change
          />
          <button className="filter-btn" onClick={() => setShowFilter(!showFilter)}>
            Filter <IoIosArrowDown />
          </button>
        </div>

        {showFilter && (
          <div className="filter-dropdown">
            <div className="filter-section">
              <h4>Status</h4>
              <div>
                <label>
                  <input type="checkbox" checked={statusFilter.length === 0} onChange={() => handleStatusChange('All')} />
                  All
                </label>
                <label>
                  <input type="checkbox" checked={statusFilter.includes('Active')} onChange={() => handleStatusChange('Active')} />
                  Active
                </label>
                <label>
                  <input type="checkbox" checked={statusFilter.includes('Upcoming')} onChange={() => handleStatusChange('Upcoming')} />
                  Upcoming
                </label>
                <label>
                  <input type="checkbox" checked={statusFilter.includes('Past')} onChange={() => handleStatusChange('Past')} />
                  Past
                </label>
              </div>
            </div>

            <div className="filter-section">
              <h4>Level</h4>
              <div>
                <label>
                  <input type="checkbox" checked={levelFilter.length === 0} onChange={() => handleLevelChange('All')} />
                  All
                </label>
                <label>
                  <input type="checkbox" checked={levelFilter.includes('Easy')} onChange={() => handleLevelChange('Easy')} />
                  Easy
                </label>
                <label>
                  <input type="checkbox" checked={levelFilter.includes('Medium')} onChange={() => handleLevelChange('Medium')} />
                  Medium
                </label>
                <label>
                  <input type="checkbox" checked={levelFilter.includes('Hard')} onChange={() => handleLevelChange('Hard')} />
                  Hard
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredChallenges.length > 0 ? (
        <div className="card-grid">
          {filteredChallenges.map((card) => {
            const status = getStatus(card.startDate, card.endDate);
            const timer = timers[card.id] || { days: 0, hours: 0, minutes: 0 };

            return (
              <div className="card" key={card.id} onClick={() => navigate(`/challenge/${card.id}`)}>
                <img src={card.image} alt={card.challengeName} className="card-image" />
                <div className={`card-status ${status}`}>
                  {status}
                </div>
                <h3>{card.challengeName}</h3>
                {status === "Upcoming" ? (
                  <div className="timer">
                    <span>Starts in</span>
                    <p style={{ fontWeight: 'bold', margin: '0px' }}>{`${formatTime(timer.days)} : ${formatTime(timer.hours)} : ${formatTime(timer.minutes)}`}</p>
                    <div className="timer-labels">
                      <span>Days</span>
                      <span>Hours</span>
                      <span>Mins</span>
                    </div>
                  </div>
                ) : status === "Active" ? (
                  <div className="timer">
                    <span>Ends in</span>
                    <p style={{ fontWeight: 'bold', margin: '0px' }}>{`${formatTime(timer.days)} : ${formatTime(timer.hours)} : ${formatTime(timer.minutes)}`}</p>
                    <div className="timer-labels">
                      <span>Days</span>
                      <span>Hours</span>
                      <span>Mins</span>
                    </div>
                  </div>
                ) : status === "Past" ? (
                  <div className="endedOn">
                    <span>Ended on</span>
                    <p style={{fontWeight: 'bold'}}>{new Date(card.endDate).toLocaleString()}</p>
                  </div>
                ) : null}

                <button className="card-button">Participate Now</button>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No challenges found for the selected filters.</p>
      )}
    </>
  );
};

export default Challenges;
