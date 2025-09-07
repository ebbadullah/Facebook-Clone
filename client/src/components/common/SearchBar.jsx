"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Person } from "@mui/icons-material"
import { Avatar, Box, Typography, CircularProgress } from "@mui/material"
import userService from "../../services/userService"
import { Link } from "react-router-dom"

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch()
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const response = await userService.searchUsers(searchQuery)
      if (response.data.status) {
        setSearchResults(response.data.data)
        setShowResults(true)
      }
    } catch (error) {
      console.error("Error searching users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{ position: "relative", width: "100%", maxWidth: 400 }} ref={searchRef}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#f0f2f5",
          borderRadius: "50px",
          px: 3,
          py: 1.5,
          border: "1px solid transparent",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "#e4e6ea",
          },
          "&:focus-within": {
            backgroundColor: "#ffffff",
            borderColor: "#1877f2",
            boxShadow: "0 0 0 2px rgba(24,119,242,0.2)",
          },
        }}
      >
        <Search sx={{ color: "#65676b", fontSize: 20, mr: 1 }} />
        <input
          type="text"
          placeholder="Search Facebook"
          style={{
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            width: "100%",
            fontSize: "15px",
            color: "#1c1e21",
            fontWeight: 400,
            fontFamily: "inherit",
          }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim() && setShowResults(true)}
        />
        {isLoading && <CircularProgress size={16} sx={{ color: "#1877f2", ml: 1 }} />}
      </Box>

      {showResults && searchResults.length > 0 && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            mt: 1,
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            border: "1px solid #e4e6ea",
            zIndex: 50,
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#65676b",
                mb: 1,
                px: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Person sx={{ fontSize: 16 }} />
              People
            </Typography>
            {searchResults.map((user) => (
              <Link
                to={`/profile/${user._id}`}
                key={user._id}
                style={{ textDecoration: "none" }}
                onClick={() => setShowResults(false)}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    borderRadius: "10px",
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#f0f2f5",
                    },
                  }}
                >
                  <Avatar
                    src={user.ProfilePicture || "https://via.placeholder.com/40"}
                    alt={user.name}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "#1c1e21",
                        fontSize: "15px",
                      }}
                    >
                      {user.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#65676b",
                        fontSize: "13px",
                      }}
                    >
                      @{user.username}
                    </Typography>
                  </Box>
                </Box>
              </Link>
            ))}
          </Box>
        </Box>
      )}

      {showResults && searchQuery.trim() && searchResults.length === 0 && !isLoading && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            mt: 1,
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            border: "1px solid #e4e6ea",
            zIndex: 50,
          }}
        >
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Search sx={{ fontSize: 48, color: "#e4e6ea", mb: 2 }} />
            <Typography variant="body1" sx={{ color: "#65676b", fontWeight: 500 }}>
              No results for "{searchQuery}"
            </Typography>
            <Typography variant="body2" sx={{ color: "#8a8d91", mt: 0.5 }}>
              Try searching for something else
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default SearchBar
