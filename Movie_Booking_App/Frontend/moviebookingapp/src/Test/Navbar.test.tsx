import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom"; 
import NavBar from "../components/pages/NavBar"; 

describe("NavBar", () => {
  const setIsLoggedIn = jest.fn();
  const setUserRole = jest.fn();

  test("renders the logo", () => {
    render(
      <Router>
        <NavBar
          isLoggedIn={false}
          userRole=""
          setIsLoggedIn={setIsLoggedIn}
          setUserRole={setUserRole}
        />
      </Router>
    );

    const logo = screen.getByTestId("logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveTextContent("MovieApp");
  });

  test("displays the correct links when not logged in", () => {
    render(
      <Router>
        <NavBar
          isLoggedIn={false}
          userRole=""
          setIsLoggedIn={setIsLoggedIn}
          setUserRole={setUserRole}
        />
      </Router>
    );

    const moviesLink = screen.getByTestId("/movies");
    const loginLink = screen.getByTestId("/login");

    expect(moviesLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
  });

  test("displays the correct links for a logged-in Admin", () => {
    render(
      <Router>
        <NavBar
          isLoggedIn={true}
          userRole="Admin"
          setIsLoggedIn={setIsLoggedIn}
          setUserRole={setUserRole}
        />
      </Router>
    );

    const addMoviesLink = screen.getByTestId("/managemovies");
    const moviesLink = screen.getByTestId("/movies");
    const logoutLink = screen.getByText("Logout");

    expect(addMoviesLink).toBeInTheDocument();
    expect(moviesLink).toBeInTheDocument();
    expect(logoutLink).toBeInTheDocument();
  });

  test("displays the correct links for a logged-in user (non-Admin)", () => {
    render(
      <Router>
        <NavBar
          isLoggedIn={true}
          userRole="User"
          setIsLoggedIn={setIsLoggedIn}
          setUserRole={setUserRole}
        />
      </Router>
    );

    const bookingsLink = screen.getByTestId("/orders");
    const watchlistLink = screen.getByTestId("/watchlist");
    const favoriteLink = screen.getByTestId("/favorite");
    const logoutLink = screen.getByText("Logout");

    expect(bookingsLink).toBeInTheDocument();
    expect(watchlistLink).toBeInTheDocument();
    expect(favoriteLink).toBeInTheDocument();
    expect(logoutLink).toBeInTheDocument();
  });

  test("handles logout correctly", () => {
    render(
      <Router>
        <NavBar
          isLoggedIn={true}
          userRole="User"
          setIsLoggedIn={setIsLoggedIn}
          setUserRole={setUserRole}
        />
      </Router>
    );

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("userId")).toBeNull();
    expect(localStorage.getItem("userRole")).toBeNull();
    expect(setIsLoggedIn).toHaveBeenCalledWith(false);
    expect(setUserRole).toHaveBeenCalledWith("");
  });

});
