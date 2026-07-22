#!/bin/bash
mongosh erp_crm_dev --quiet << 'EOF'
db.users.findOne({email: "admin@enterpriseflow.com"})
EOF
