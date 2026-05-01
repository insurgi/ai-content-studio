Feature: Mobile navigation
  As a creator using a mobile device
  I want a hamburger menu that opens a full sidebar drawer
  So that I can navigate between all sections of the app on a small screen

  Background:
    Given the creator is signed in
    And the creator is viewing the app on a screen narrower than 768px

  Scenario: Creator opens the navigation drawer on mobile
    Given the persistent sidebar is hidden because the screen is narrow
    When the creator taps the hamburger menu icon in the header
    Then the sidebar drawer slides in from the left
    And all navigation items are visible: Dashboard, Scripts, Calendar, AI Twins, Studio, Analytics, Settings

  Scenario: Creator navigates to a section using the mobile drawer
    Given the sidebar drawer is open
    When the creator selects "AI Twins" from the navigation list
    Then the drawer closes
    And the creator sees the AI Twins page
    And the URL updates to /twins

  Scenario: Creator closes the drawer by tapping the overlay
    Given the sidebar drawer is open
    When the creator taps outside the drawer on the dimmed overlay
    Then the drawer closes
    And the current page content remains unchanged

  Scenario: Creator sees their credit balance inside the mobile drawer
    Given the sidebar drawer is open
    Then the creator's remaining credit balance and usage bar are visible in the drawer

  Scenario: Sidebar appears when screen widens past the breakpoint
    Given the persistent sidebar is hidden on a narrow screen
    When the creator widens the browser window past 768px
    Then the persistent sidebar appears automatically
    And the hamburger menu icon is hidden

  Scenario: Hamburger menu appears when screen narrows below the breakpoint
    Given the creator is on desktop with the sidebar visible
    When the creator narrows the browser window below 768px
    Then the persistent sidebar is hidden
    And the hamburger menu icon appears in the header

  # QUESTION: Should the hamburger be top-left or top-right? Convention favours top-left.

  Scenario: Creator signs out from the mobile drawer
    Given the sidebar drawer is open
    When the creator taps "Sign out"
    Then the creator is signed out
    And the drawer closes
    And the creator is redirected to /login

  Scenario: Active navigation item is highlighted in the mobile drawer
    Given the creator is currently on the /calendar page
    When the creator opens the sidebar drawer
    Then the "Calendar" navigation item is shown as active
    And all other items are shown as inactive
