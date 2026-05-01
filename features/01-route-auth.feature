Feature: Route-based navigation and authentication guard
  As a creator using AI Twin Studio
  I want every section of the app to be accessible via its own URL
  So that I can share deep links, use the browser back button, and get redirected to login when my session expires

  Background:
    Given the application routes are: /dashboard, /scripts, /calendar, /twins, /studio, /analytics, /settings

  Scenario: Authenticated user navigates directly to a route by URL
    Given the creator is signed in
    When the creator visits /scripts directly in the browser
    Then the creator sees the Script Generator panel
    And the URL remains /scripts

  Scenario: Authenticated user moves between routes using the sidebar
    Given the creator is signed in and viewing /dashboard
    When the creator selects "Calendar" in the sidebar navigation
    Then the creator sees the Content Calendar panel
    And the URL updates to /calendar

  Scenario: Authenticated user uses the browser back button after navigation
    Given the creator is signed in and has navigated from /dashboard to /twins
    When the creator presses the browser back button
    Then the creator sees the Dashboard panel
    And the URL returns to /dashboard

  Scenario: Unauthenticated visitor is redirected to login from any protected route
    Given the creator is not signed in
    When the creator visits /dashboard
    Then the creator is redirected to /login
    And the login screen is displayed

  Scenario: Unauthenticated visitor is redirected from a deep protected route
    Given the creator is not signed in
    When the creator visits /studio
    Then the creator is redirected to /login

  # QUESTION: Should the originally requested URL be preserved as a redirect
  # parameter (e.g. /login?redirect=/studio) so the creator lands there after signing in?

  Scenario: Creator is sent to the dashboard after signing in
    Given the creator is on the /login screen
    When the creator signs in with valid credentials
    Then the creator is redirected to /dashboard
    And the sidebar navigation is visible

  Scenario: Authenticated creator visits an unknown URL
    Given the creator is signed in
    When the creator visits /doesnotexist
    Then the creator sees the 404 not-found page
    And the page offers a link back to /dashboard

  Scenario: Unauthenticated visitor visits an unknown URL
    Given the creator is not signed in
    When the creator visits /doesnotexist
    Then the creator is redirected to /login
