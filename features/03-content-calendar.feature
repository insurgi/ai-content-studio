Feature: Content Calendar
  As a creator
  I want to view, schedule, and reschedule my content on a visual calendar
  So that I can manage my publishing pipeline and avoid content gaps at a glance

  Background:
    Given the creator is signed in
    And the creator is on the /calendar page

  # QUESTION: Which view is the default — month, week, or day?

  Scenario: Creator views their scheduled content in week view
    Given the creator has scheduled content across several days this week
    When the creator opens the Content Calendar in week view
    Then each scheduled reel appears on its correct day
    And each item displays the content title and target platform

  Scenario: Creator switches to day view to see hourly slots
    Given the creator is in week view
    When the creator selects "Day" view
    Then the calendar shows hourly time slots for a single day
    And each scheduled item appears in its correct time slot

  Scenario: Creator reschedules a piece of content by dragging it to a new day
    Given the creator has a reel scheduled for Monday
    When the creator drags the reel to Wednesday
    Then the reel moves to Wednesday on the calendar
    And the reel's scheduled publish date is updated
    And the creator sees a confirmation that the schedule was saved

  Scenario: Creator drags content to a day that has hit the platform's post limit
    Given Wednesday already has 3 Instagram posts scheduled
    When the creator drags a 4th Instagram reel onto Wednesday
    Then the reel is not moved
    And the creator sees a message explaining the platform limit has been reached

  # QUESTION: Is there a per-platform daily post limit enforced by the system, or advisory only?

  Scenario: Creator creates a new scheduled item from the calendar
    Given the creator is in week view
    When the creator selects an empty day slot
    Then a drawer slides in
    And the creator can choose a script, target platform, and publish date/time
    And on saving the new item appears on the calendar on the chosen day

  Scenario: Creator cancels creating a new scheduled item
    Given the ScheduleDrawer is open with partially entered details
    When the creator dismisses the drawer
    Then no new item is added to the calendar
    And the creator's partially entered details are discarded

  Scenario: Creator views the calendar when no content is scheduled
    Given the creator has no scheduled content
    When the creator opens the Content Calendar
    Then an empty-state message encourages the creator to schedule their first reel

  Scenario: Creator attempts to reschedule content to a date in the past
    Given the creator has a reel scheduled for next Tuesday
    When the creator drags the reel to a date that has already passed
    Then the reel is not moved
    And the creator sees a message that past dates cannot be scheduled
