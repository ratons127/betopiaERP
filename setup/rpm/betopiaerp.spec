%global name betopiaerp
%global unmangled_version %{version}
%global __requires_exclude ^.*betopiaerp/addons/mail/static/scripts/betopiaerp-mailgate.py$

Summary: BetopiaERP Server
Name: %{name}
Version: %{version}
Release: %{release}
Source0: %{name}-%{unmangled_version}.tar.gz
License: LGPL-3
Group: Development/Libraries
BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-buildroot
Prefix: %{_prefix}
BuildArch: noarch
Vendor: BetopiaERP <info@betopiaerp.com>
Requires: sassc
BuildRequires: python3-devel
BuildRequires: pyproject-rpm-macros
Url: https://www.BetopiaERP.com

%description
BetopiaERP is a complete ERP and CRM. The main features are accounting (analytic
and financial), stock management, sales and purchases management, tasks
automation, marketing campaigns, help desk, POS, etc. Technical features include
a distributed server, an object database, a dynamic GUI,
customizable reports, and XML-RPC interfaces.

%generate_buildrequires
%pyproject_buildrequires

%prep
%autosetup

%build
%py3_build

%install
%py3_install

%post
#!/bin/sh

set -e

BETOPIAERP_CONFIGURATION_DIR=/etc/betopiaerp
BETOPIAERP_CONFIGURATION_FILE=$BETOPIAERP_CONFIGURATION_DIR/betopiaerp.conf
BETOPIAERP_DATA_DIR=/var/lib/betopiaerp
BETOPIAERP_GROUP="betopiaerp"
BETOPIAERP_LOG_DIR=/var/log/betopiaerp
BETOPIAERP_LOG_FILE=$BETOPIAERP_LOG_DIR/betopiaerp-server.log
BETOPIAERP_USER="betopiaerp"

if ! getent passwd | grep -q "^betopiaerp:"; then
    groupadd $BETOPIAERP_GROUP
    adduser --system --no-create-home $BETOPIAERP_USER -g $BETOPIAERP_GROUP
fi
# Register "$BETOPIAERP_USER" as a postgres user with "Create DB" role attribute
su - postgres -c "createuser -d -R -S $BETOPIAERP_USER" 2> /dev/null || true
# Configuration file
mkdir -p $BETOPIAERP_CONFIGURATION_DIR
# can't copy debian config-file as addons_path is not the same
if [ ! -f $BETOPIAERP_CONFIGURATION_FILE ]
then
    echo "[options]
; This is the password that allows database operations:
; admin_passwd = admin
db_host = False
db_port = False
db_user = $BETOPIAERP_USER
db_password = False
addons_path = %{python3_sitelib}/betopiaerp/addons
default_productivity_apps = True
" > $BETOPIAERP_CONFIGURATION_FILE
    chown $BETOPIAERP_USER:$BETOPIAERP_GROUP $BETOPIAERP_CONFIGURATION_FILE
    chmod 0640 $BETOPIAERP_CONFIGURATION_FILE
fi
# Log
mkdir -p $BETOPIAERP_LOG_DIR
chown $BETOPIAERP_USER:$BETOPIAERP_GROUP $BETOPIAERP_LOG_DIR
chmod 0750 $BETOPIAERP_LOG_DIR
# Data dir
mkdir -p $BETOPIAERP_DATA_DIR
chown $BETOPIAERP_USER:$BETOPIAERP_GROUP $BETOPIAERP_DATA_DIR

INIT_FILE=/lib/systemd/system/betopiaerp.service
touch $INIT_FILE
chmod 0700 $INIT_FILE
cat << EOF > $INIT_FILE
[Unit]
Description=BetopiaERP Open Source ERP and CRM
After=network.target

[Service]
Type=simple
User=betopiaerp
Group=betopiaerp
ExecStart=/usr/bin/betopiaerp --config $BETOPIAERP_CONFIGURATION_FILE --logfile $BETOPIAERP_LOG_FILE
KillMode=mixed

[Install]
WantedBy=multi-user.target
EOF

%files
%{_bindir}/betopiaerp
%{python3_sitelib}/%{name}-*.egg-info
%{python3_sitelib}/%{name}
%pycached %exclude %{python3_sitelib}/doc/cla/stats.py
%pycached %exclude %{python3_sitelib}/setup/*.py
%exclude %{python3_sitelib}/setup/betopiaerp

%changelog
* %{build_date} Christophe Monniez <moc@betopiaerp.com> - %{version}-%{release}
- Latest updates
