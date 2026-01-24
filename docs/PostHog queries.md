 -- ============================================                                                                                                        -- 1. USER OVERVIEW (excluding your accounts)
  -- ============================================                                                                                                      
  SELECT
      properties->>'$user_id' as user_id,
      properties->>'email' as email,
      MIN(timestamp) as first_seen,
      MAX(timestamp) as last_seen,
      COUNT(*) as total_events,
      COUNT(DISTINCT DATE(timestamp)) as active_days
  FROM events
  WHERE
      properties->>'email' NOT IN ('omar.qouqas@gmail.com', 'soccerrefplanet@gmail.com')
      AND properties->>'$current_url' NOT LIKE '%localhost%'
      AND properties->>'$host' NOT LIKE '%localhost%'
      AND event NOT LIKE '$%'  -- exclude PostHog internal events
  GROUP BY properties->>'$user_id', properties->>'email'
  ORDER BY first_seen DESC;


  -- ============================================
  -- 2. CONVERSION FUNNEL (signup → calendar)
  -- ============================================
  WITH funnel AS (
      SELECT
          distinct_id,
          MAX(CASE WHEN event = 'user_signed_up' THEN 1 ELSE 0 END) as signed_up,
          MAX(CASE WHEN event = 'onboarding_started' THEN 1 ELSE 0 END) as started_onboarding,
          MAX(CASE WHEN event = 'onboarding_completed' THEN 1 ELSE 0 END) as completed_onboarding,
          MAX(CASE WHEN event = 'calendar_viewed' THEN 1 ELSE 0 END) as viewed_calendar,
          MAX(CASE WHEN event = 'upgrade_prompt_shown' THEN 1 ELSE 0 END) as saw_upgrade,
          MAX(CASE WHEN event = 'subscription_created' THEN 1 ELSE 0 END) as subscribed
      FROM events
      WHERE
          properties->>'email' NOT IN ('omar.qouqas@gmail.com', 'soccerrefplanet@gmail.com')
          AND properties->>'$current_url' NOT LIKE '%localhost%'
      GROUP BY distinct_id
  )
  SELECT
      SUM(signed_up) as "1. Signed Up",
      SUM(started_onboarding) as "2. Started Onboarding",
      SUM(completed_onboarding) as "3. Completed Onboarding",
      SUM(viewed_calendar) as "4. Viewed Calendar",
      SUM(saw_upgrade) as "5. Saw Upgrade Prompt",                                                                                                     
      SUM(subscribed) as "6. Subscribed"
  FROM funnel;


  -- ============================================
  -- 3. FEATURE USAGE (what features are used)
  -- ============================================
  SELECT
      event,
      COUNT(*) as count,
      COUNT(DISTINCT distinct_id) as unique_users
  FROM events
  WHERE
      properties->>'email' NOT IN ('omar.qouqas@gmail.com', 'soccerrefplanet@gmail.com')
      AND properties->>'$current_url' NOT LIKE '%localhost%'
      AND event IN (
          'calendar_viewed',
          'scenario_tested',
          'bill_created',
          'income_created',
          'account_created',
          'invoice_created',
          'invoice_sent',
          'reminder_sent',
          'feedback_submitted',
          'upgrade_prompt_shown',
          'upgrade_initiated',
          'subscription_created'
      )
  GROUP BY event
  ORDER BY count DESC;


  -- ============================================
  -- 4. ONBOARDING DROP-OFF (where users stop)
  -- ============================================
  SELECT
      event,
      COUNT(DISTINCT distinct_id) as users,
      properties->>'step' as step
  FROM events
  WHERE
      properties->>'email' NOT IN ('omar.qouqas@gmail.com', 'soccerrefplanet@gmail.com')
      AND properties->>'$current_url' NOT LIKE '%localhost%'
      AND event IN ('onboarding_started', 'onboarding_step_completed', 'onboarding_completed')
  GROUP BY event, properties->>'step'
  ORDER BY event, step;


  -- ============================================
  -- 5. PAGE VIEWS (most visited pages)
  -- ============================================
  SELECT
      properties->>'$pathname' as page,
      COUNT(*) as views,
      COUNT(DISTINCT distinct_id) as unique_visitors
  FROM events
  WHERE
      event = '$pageview'
      AND properties->>'email' NOT IN ('omar.qouqas@gmail.com', 'soccerrefplanet@gmail.com')
      AND properties->>'$current_url' NOT LIKE '%localhost%'
      AND properties->>'$pathname' LIKE '/dashboard%'
  GROUP BY properties->>'$pathname'
  ORDER BY views DESC
  LIMIT 20;


  -- ============================================
  -- 6. USER RETENTION (days since signup)
  -- ============================================
  WITH user_activity AS (
      SELECT
          distinct_id,
          MIN(CASE WHEN event = 'user_signed_up' THEN timestamp END) as signup_date,
          MAX(timestamp) as last_activity
      FROM events
      WHERE
          properties->>'email' NOT IN ('omar.qouqas@gmail.com', 'soccerrefplanet@gmail.com')
          AND properties->>'$current_url' NOT LIKE '%localhost%'
      GROUP BY distinct_id
      HAVING MIN(CASE WHEN event = 'user_signed_up' THEN timestamp END) IS NOT NULL
  )
  SELECT
      distinct_id,
      signup_date,
      last_activity,
      DATE_PART('day', last_activity - signup_date) as days_active,
      CASE
          WHEN DATE_PART('day', NOW() - last_activity) <= 7 THEN 'Active (7d)'
          WHEN DATE_PART('day', NOW() - last_activity) <= 30 THEN 'Inactive (7-30d)'
          ELSE 'Churned (30d+)'
      END as status
  FROM user_activity
  ORDER BY signup_date DESC;


  -- ============================================
  -- 7. FEEDBACK SUBMISSIONS
  -- ============================================
  SELECT
      timestamp,
      properties->>'email' as email,
      properties->>'type' as feedback_type,
      properties->>'message_length' as message_length
  FROM events
  WHERE
      event = 'feedback_submitted'
      AND properties->>'email' NOT IN ('omar.qouqas@gmail.com', 'soccerrefplanet@gmail.com')
  ORDER BY timestamp DESC;


  -- ============================================
  -- 8. WEEKLY DIGEST ENGAGEMENT
  -- ============================================
  SELECT
      event,
      COUNT(*) as count,
      COUNT(DISTINCT distinct_id) as unique_users
  FROM events
  WHERE
      event IN ('digest_sent', 'digest_opened', 'digest_clicked', 'digest_unsubscribed')
      AND properties->>'$current_url' NOT LIKE '%localhost%'
  GROUP BY event;

  How to run these:

  1. PostHog SQL Editor: Go to PostHog → Data Management → SQL (if enabled on your plan)
  2. Export & Local: Export events as CSV, import to a local PostgreSQL, run queries
  3. HogQL: PostHog's query language - slightly different syntax but similar

  Run queries 2, 3, and 4 first - those will tell us:
  - Where users drop off in the funnel
  - Which features are actually used
  - Where onboarding fails

  Share the results and I can suggest specific code changes based on the data.