#!/bin/bash
# SubInsights Demo Mouse Path
# Requires: cliclick (brew install cliclick)
# Usage: bash scripts/demo-mouse-path.sh
# Run AFTER opening http://localhost:3000?demo=1 in browser
# Coordinates based on 1440x900 browser window, fullscreen

set -e

DELAY=0.5  # seconds between moves

echo "Starting demo in 3 seconds... switch to browser window"
sleep 3

# Scene 1: Page loaded — mouse center
cliclick m:720,400
sleep 2

# Scene 2: KPI Cards — move across each card
echo "Scene 2: KPI Cards"
cliclick m:180,220   # MRR card
sleep 1.5
cliclick m:450,220   # Active Subscriptions
sleep 1.5
cliclick m:720,220   # Active Trials
sleep 1.5
cliclick m:990,220   # Revenue
sleep 1.5

# Scene 3: Weekly Memo — highlight block, then copy button
echo "Scene 3: Weekly Memo"
cliclick m:720,380   # memo center
sleep 1.0
cliclick m:720,420   # findings area
sleep 1.0
cliclick m:720,460   # action items
sleep 1.0
cliclick m:1050,300  # Copy button area
sleep 0.5
cliclick c:1050,300  # click copy
sleep 1.0

# Scene 4: Time range selector
echo "Scene 4: Time range"
cliclick m:900,560   # range selector area
sleep 0.5
cliclick c:860,560   # 1M button
sleep 1.0
cliclick c:900,560   # 3M button
sleep 1.0
cliclick c:940,560   # 1Y button
sleep 1.0
cliclick c:980,560   # ALL button
sleep 1.0

# Scene 5: MRR Chart — trace the curve
echo "Scene 5: MRR Chart"
cliclick m:200,680
sleep 0.3
cliclick m:400,640
sleep 0.3
cliclick m:600,620
sleep 0.3
cliclick m:800,610
sleep 0.3
cliclick m:1000,608
sleep 0.3
cliclick m:1200,605
sleep 1.0

# Scene 6: Funnel + Churn
echo "Scene 6: Funnel + Churn"
cliclick m:360,820   # funnel area
sleep 1.5
cliclick m:900,820   # churn area
sleep 1.5
cliclick m:1100,820  # donut area
sleep 1.5

# Scene 7: Scroll to footer
echo "Scene 7: Footer"
cliclick m:720,950
sleep 2.0

echo "Demo path complete"
