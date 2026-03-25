Here are the **ASCII sketches** for the MSP-flavored demo, pulled together from the demo notes and the MSP positioning doc.  

## 1. Core MSP command-center layout

```text
+==================================================================================================+
| MSP COMMAND CENTER                                                                               |
| Tenant: [ Acme Corp ▼ ]   Beta Retail   Gamma Health                           Mode: Incident   |
+==================================================================================================+
| INCIDENTS                                  | MESSAGE / EVENT STREAM                              |
|--------------------------------------------+-----------------------------------------------------|
| INV-2024-0312  Active   Beta Retail        | tenant_id   time       source        message        |
| PAY-2024-0315  Resolved Acme Corp          | Beta       12:01:05   cart-ui       cart.item...   |
| CFG-2024-0316  Active   Gamma Health       | Beta       12:01:05   checkout      checkout...    |
|                                            | Beta       12:01:06   inventory     NODE-2003      |
+--------------------------------------------+-----------------------------------------------------+
| NODE / SERVICE STATUS                      | AI OPERATOR TERMINAL                                |
|--------------------------------------------+-----------------------------------------------------|
| cart-ui             OK                     | > switching context: Beta Retail                    |
| checkout-service    DEGRADED               | > incident detected: INV-2024-0312                  |
| payments-service    OK                     | > root cause: inventory-service unavailable         |
| inventory-service   DOWN                   | > impact: checkout degraded, payments unaffected    |
| ops-console         OK                     | > recommended action: restart inventory-service     |
+==================================================================================================+
```

## 2. Multi-tenant operator view

```text
                    +----------------------------------+
                    |         MSP OPERATOR             |
                    | manages many customers at once   |
                    +----------------+-----------------+
                                     |
         +---------------------------+---------------------------+
         |                           |                           |
         v                           v                           v
+-------------------+     +-------------------+     +-------------------+
|   Acme Corp       |     |   Beta Retail     |     |   Gamma Health    |
| all systems green |     | inventory issue   |     | config drift      |
+---------+---------+     +---------+---------+     +---------+---------+
          |                         |                         |
          v                         v                         v
   +-------------+           +-------------+           +-------------+
   | ACN view    |           | ACN view    |           | ACN view    |
   | messages    |           | incidents   |           | diagnostics |
   | diagnostics |           | root cause  |           | playbooks   |
   +-------------+           +-------------+           +-------------+
```

## 3. Incident view

```text
+----------------------------------------------------------------------------------+
| INCIDENT VIEW                                                                    |
+----------------------------------------------------------------------------------+
| Incident ID: INV-2024-0312                                                       |
| Tenant:      Beta Retail                                                         |
| Status:      Active                                                              |
| Severity:    High                                                                |
+----------------------------------------------------------------------------------+
| ROOT SIGNAL                                                                      |
| NODE-2003  inventory-service DOWN                                                |
+----------------------------------------------------------------------------------+
| IMPACT                                                                           |
| - checkout-service: degraded                                                     |
| - payments-service: normal                                                       |
| - customer-facing symptom: delayed fulfillment / partial checkout degradation    |
+----------------------------------------------------------------------------------+
| RECOMMENDED ACTION                                                               |
| 1. Check inventory-service health                                                |
| 2. Restart inventory-service                                                     |
| 3. Verify message flow resumes                                                   |
+----------------------------------------------------------------------------------+
```

## 4. Trace-path sketch

```text
correlation_id: f91aa220

cart-ui
   |
   v
checkout-service
   |
   +------------------> payments-service   [OK]
   |
   v
inventory-service      [DOWN]
   |
   X failure boundary detected here

Result:
- failure contained
- checkout degraded
- no full cascade
```

## 5. Playbook execution sketch

```text
+------------------------------------------------------+
| PLAYBOOK: inventory-failure                          |
+------------------------------------------------------+
| Step 1: GET /diagnostics/health                      |
|         -> FAILED                                    |
|                                                      |
| Step 2: restart inventory-service                    |
|         -> SUCCESS                                   |
|                                                      |
| Step 3: verify event flow                            |
|         -> cart.item_added.v1 observed               |
|         -> checkout.session_started.v1 observed      |
|         -> inventory recovered                       |
+------------------------------------------------------+
```

## 6. Stream view vs incident view toggle

```text
+----------------------------------------------------------------------------------+
| [ Stream View ]   [ Incident View ]                                              |
+----------------------------------------------------------------------------------+

STREAM VIEW
-----------
time        source              message_id                      corr
12:01:05    cart-ui             cart.item_added.v1             s-991
12:01:05    checkout-service    checkout.session_started.v1    s-991
12:01:06    inventory-service   NODE-2003                      s-991


INCIDENT VIEW
-------------
incident: INV-2024-0312
tenant:   Beta Retail
root:     inventory-service unavailable
impact:   checkout degraded
action:   restart service
```

## 7. Time-saved sales panel

```text
+---------------------------------------+
| INCIDENT METRICS                      |
+---------------------------------------+
| Time to detection:   2.1s             |
| Time to diagnosis:   4.8s             |
| Manual triage est.:  45m              |
| Time saved:          44m 52s          |
+---------------------------------------+
```

## 8. Before vs after slide sketch

```text
+--------------------------------+     +--------------------------------+
| Traditional Ops                |     | ACN MSP Command Center         |
+--------------------------------+     +--------------------------------+
| - 5 disconnected tools         |     | - 1 interface                  |
| - 45 min triage                |     | - 5 sec diagnosis              |
| - unclear ownership            |     | - clear root cause             |
| - escalation required          |     | - contained failure            |
| - per-customer chaos           |     | - multi-tenant visibility      |
+--------------------------------+     +--------------------------------+

                > you are not debugging systems anymore
                > you are operating them
```

## 9. ACN topology underneath the MSP skin

This is the protocol/demo backbone the MSP layer sits on top of. 

```text
         +----------------------+
         |     shell-app UI     |
         +----------+-----------+
                    |
         +----------v-----------+
         | Message Stream Viewer|
         +----------+-----------+
                    |
  +-----------------+------------------+
  |                 |                  |
+ v --------+ +-----v--------+ +-------v------+
| checkout  | | payments     | | inventory    |
| service   | | service      | | service      |
+-----+-----+ +--------------+ +------+-------+
      ^                              |
      |                              |
+-----+------+                 +-----v------+
| cart-ui    |---------------->| ops-console|
| frontend   |                 | diagnostics|
+------------+                 +------------+
```

## 10. Best “30-second demo story” sketch

```text
[Pick tenant]
     |
     v
[Healthy system]
     |
     v
[Switch to failing tenant]
     |
     v
[Incident auto-detected]
     |
     v
[Root cause shown]
     |
     v
[Playbook executed]
     |
     v
[Recovery confirmed]
     |
     v
[Time saved displayed]
```
