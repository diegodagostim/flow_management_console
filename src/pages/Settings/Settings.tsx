import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAdapter } from '@/app/store'
import type { RootState } from '@/app/store'
import { UserGroupManagement } from '@/components/UserGroupManagement'
import { IntegrationSettings } from '@/components/IntegrationSettings'
import { PageHeader } from '@/components/navigation/PageHeader'
import { useTimeRegion } from '@/hooks/useTimeRegion'
import { 
  Database, 
  Settings as SettingsIcon, 
  Building2, 
  Save, 
  Server,
  Globe,
  Users,
  Key,
  Mail,
  Phone,
  MapPin,
  Clock,
  Map,
  Calendar,
  DollarSign,
  Plug,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

export function Settings() {
  const dispatch = useDispatch();
  const currentAdapter = useSelector((state: RootState) => state.storage.adapter);
  const { settings: timeRegionSettings, updateSettings: updateTimeRegionSettings, currentDateTime } = useTimeRegion();
  const [supabaseUrl, setSupabaseUrl] = useState(import.meta.env.VITE_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [companyData, setCompanyData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [originalTimezone, setOriginalTimezone] = useState(timeRegionSettings.timezone);

  const handleAdapterChange = (adapter: 'local' | 'supabase') => {
    dispatch(setAdapter(adapter))
  }

  const handleCompanyChange = (field: string, value: string) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  }

  const handleSaveCompany = () => {
    console.log('Company details saved:', companyData);
  }

  const handleSaveSupabase = () => {
    console.log('Supabase configuration saved');
  }

  const handleTimeRegionChange = (field: string, value: string) => {
    updateTimeRegionSettings({ [field]: value });
  }

  const handleSaveTimeRegion = () => {
    console.log('Time & Region settings saved:', timeRegionSettings);
    
    // Check if timezone was changed
    const timezoneChanged = originalTimezone !== timeRegionSettings.timezone;
    
    if (timezoneChanged) {
      // Show a brief message before refreshing
      console.log('Timezone changed, refreshing application...');
      
      // Show user notification
      alert('Timezone changed! The application will refresh to apply the new timezone settings.');
      
      // Update the original timezone to the new value
      setOriginalTimezone(timeRegionSettings.timezone);
      
      // Small delay to ensure settings are saved
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }

  return (
    <div className="container-fluid settings-page">
      <PageHeader 
        title="Settings"
        subtitle="Manage your application configuration and preferences"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Settings', active: true }
        ]}
      />

      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-lg settings-page">
            <div className="card-header border-0 px-0 pt-4 pb-0">
              <ul className="nav nav-tabs card-header-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button 
                    className="nav-link active" 
                    id="company-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#company" 
                    type="button" 
                    role="tab"
                    aria-controls="company"
                    aria-selected="true"
                  >
                    <Building2 className="h-4 w-4 me-2" />
                    Company
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button 
                    className="nav-link" 
                    id="users-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#users" 
                    type="button" 
                    role="tab"
                    aria-controls="users"
                    aria-selected="false"
                  >
                    <Users className="h-4 w-4 me-2" />
                    User/Groups
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button 
                    className="nav-link" 
                    id="time-region-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#time-region" 
                    type="button" 
                    role="tab"
                    aria-controls="time-region"
                    aria-selected="false"
                  >
                    <Clock className="h-4 w-4 me-2" />
                    Time & Region
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button 
                    className="nav-link" 
                    id="general-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#general" 
                    type="button" 
                    role="tab"
                    aria-controls="general"
                    aria-selected="false"
                  >
                    <Database className="h-4 w-4 me-2" />
                    Database Switch
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button 
                    className="nav-link" 
                    id="integration-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#integration" 
                    type="button" 
                    role="tab"
                    aria-controls="integration"
                    aria-selected="false"
                  >
                    <Plug className="h-4 w-4 me-2" />
                    Integration
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              <div className="tab-content" id="settingsTabContent">
                <div className="tab-pane fade show active" id="company" role="tabpanel">
                  <div className="row">
                    <div className="col-lg-8">
                      <div className="mb-4">
                        <h5 className="mb-2 d-flex align-items-center">
                            <Building2 className="h-5 w-5 me-2 text-primary" />
                            Company Information
                          </h5>
                        <p className="text-muted small mb-3">Manage your company details and branding</p>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label htmlFor="company-name" className="form-label">
                                <Building2 className="h-4 w-4 me-1" />
                                Company Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="company-name"
                                value={companyData.name}
                                onChange={(e) => handleCompanyChange('name', e.target.value)}
                                placeholder="Enter company name"
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label htmlFor="company-email" className="form-label">
                                <Mail className="h-4 w-4 me-1" />
                                Company Email
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                id="company-email"
                                value={companyData.email}
                                onChange={(e) => handleCompanyChange('email', e.target.value)}
                                placeholder="Enter company email"
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label htmlFor="company-phone" className="form-label">
                                <Phone className="h-4 w-4 me-1" />
                                Company Phone
                              </label>
                              <input
                                type="tel"
                                className="form-control"
                                id="company-phone"
                                value={companyData.phone}
                                onChange={(e) => handleCompanyChange('phone', e.target.value)}
                                placeholder="Enter company phone"
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label htmlFor="company-address" className="form-label">
                                <MapPin className="h-4 w-4 me-1" />
                                Company Address
                              </label>
                              <textarea
                                className="form-control"
                                id="company-address"
                                rows={3}
                                value={companyData.address}
                                onChange={(e) => handleCompanyChange('address', e.target.value)}
                                placeholder="Enter company address"
                            ></textarea>
                            </div>
                          </div>
                          <div className="d-flex justify-content-end">
                            <button className="btn btn-primary" onClick={handleSaveCompany}>
                              <Save className="h-4 w-4 me-2" />
                              Save Company Details
                            </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tab-pane fade" id="users" role="tabpanel">
                  <UserGroupManagement />
                </div>

                <div className="tab-pane fade" id="time-region" role="tabpanel">
                  <div className="row">
                    <div className="col-lg-8">
                      <div className="mb-4">
                        <h5 className="mb-2 d-flex align-items-center">
                          <Clock className="h-5 w-5 me-2 text-primary" />
                          Time & Region Settings
                          </h5>
                        <p className="text-muted small mb-3">Configure timezone, date formats, and regional preferences</p>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="timezone" className="form-label">
                              <Clock className="h-4 w-4 me-1" />
                              Timezone
                            </label>
                            <select
                              className="form-select"
                              id="timezone"
                              value={timeRegionSettings.timezone}
                              onChange={(e) => handleTimeRegionChange('timezone', e.target.value)}
                            >
                              <optgroup label="UTC">
                                <option value="UTC">UTC (Coordinated Universal Time)</option>
                              </optgroup>
                              
                              <optgroup label="North America - Eastern">
                                <option value="America/New_York">Eastern Time (ET) - New York</option>
                                <option value="America/Toronto">Eastern Time (ET) - Toronto</option>
                                <option value="America/Montreal">Eastern Time (ET) - Montreal</option>
                                <option value="America/Nassau">Eastern Time (ET) - Nassau</option>
                                <option value="America/Havana">Cuba Time (CST) - Havana</option>
                                <option value="America/Port-au-Prince">Eastern Time (ET) - Port-au-Prince</option>
                                <option value="America/Santo_Domingo">Atlantic Time (AST) - Santo Domingo</option>
                              </optgroup>
                              
                              <optgroup label="North America - Central">
                                <option value="America/Chicago">Central Time (CT) - Chicago</option>
                                <option value="America/Mexico_City">Central Time (CT) - Mexico City</option>
                                <option value="America/Winnipeg">Central Time (CT) - Winnipeg</option>
                                <option value="America/Guatemala">Central Time (CT) - Guatemala</option>
                                <option value="America/Belize">Central Time (CT) - Belize</option>
                                <option value="America/El_Salvador">Central Time (CT) - El Salvador</option>
                                <option value="America/Tegucigalpa">Central Time (CT) - Tegucigalpa</option>
                                <option value="America/Managua">Central Time (CT) - Managua</option>
                                <option value="America/Costa_Rica">Central Time (CT) - Costa Rica</option>
                              </optgroup>
                              
                              <optgroup label="North America - Mountain">
                                <option value="America/Denver">Mountain Time (MT) - Denver</option>
                                <option value="America/Edmonton">Mountain Time (MT) - Edmonton</option>
                                <option value="America/Phoenix">Mountain Time (MST) - Phoenix</option>
                                <option value="America/Calgary">Mountain Time (MT) - Calgary</option>
                              </optgroup>
                              
                              <optgroup label="North America - Pacific">
                                <option value="America/Los_Angeles">Pacific Time (PT) - Los Angeles</option>
                                <option value="America/Vancouver">Pacific Time (PT) - Vancouver</option>
                                <option value="America/Tijuana">Pacific Time (PT) - Tijuana</option>
                                <option value="America/Anchorage">Alaska Time (AKST) - Anchorage</option>
                                <option value="Pacific/Honolulu">Hawaii Time (HST) - Honolulu</option>
                              </optgroup>
                              
                              <optgroup label="South America">
                                <option value="America/Sao_Paulo">Brasilia Time (BRT) - São Paulo</option>
                                <option value="America/Buenos_Aires">Argentina Time (ART) - Buenos Aires</option>
                                <option value="America/Santiago">Chile Time (CLT) - Santiago</option>
                                <option value="America/Bogota">Colombia Time (COT) - Bogotá</option>
                                <option value="America/Lima">Peru Time (PET) - Lima</option>
                                <option value="America/Caracas">Venezuela Time (VET) - Caracas</option>
                                <option value="America/Guayaquil">Ecuador Time (ECT) - Guayaquil</option>
                                <option value="America/La_Paz">Bolivia Time (BOT) - La Paz</option>
                                <option value="America/Asuncion">Paraguay Time (PYT) - Asunción</option>
                                <option value="America/Montevideo">Uruguay Time (UYT) - Montevideo</option>
                                <option value="America/Guyana">Guyana Time (GYT) - Georgetown</option>
                                <option value="America/Paramaribo">Suriname Time (SRT) - Paramaribo</option>
                              </optgroup>
                              
                              <optgroup label="Europe - Western">
                                <option value="Europe/London">Greenwich Mean Time (GMT) - London</option>
                                <option value="Europe/Dublin">Greenwich Mean Time (GMT) - Dublin</option>
                                <option value="Europe/Lisbon">Western European Time (WET) - Lisbon</option>
                                <option value="Atlantic/Azores">Azores Time (AZOT) - Azores</option>
                                <option value="Atlantic/Madeira">Western European Time (WET) - Madeira</option>
                              </optgroup>
                              
                              <optgroup label="Europe - Central">
                                <option value="Europe/Paris">Central European Time (CET) - Paris</option>
                                <option value="Europe/Berlin">Central European Time (CET) - Berlin</option>
                                <option value="Europe/Rome">Central European Time (CET) - Rome</option>
                                <option value="Europe/Madrid">Central European Time (CET) - Madrid</option>
                                <option value="Europe/Amsterdam">Central European Time (CET) - Amsterdam</option>
                                <option value="Europe/Brussels">Central European Time (CET) - Brussels</option>
                                <option value="Europe/Vienna">Central European Time (CET) - Vienna</option>
                                <option value="Europe/Zurich">Central European Time (CET) - Zurich</option>
                                <option value="Europe/Prague">Central European Time (CET) - Prague</option>
                                <option value="Europe/Warsaw">Central European Time (CET) - Warsaw</option>
                                <option value="Europe/Budapest">Central European Time (CET) - Budapest</option>
                                <option value="Europe/Zagreb">Central European Time (CET) - Zagreb</option>
                                <option value="Europe/Sarajevo">Central European Time (CET) - Sarajevo</option>
                                <option value="Europe/Belgrade">Central European Time (CET) - Belgrade</option>
                                <option value="Europe/Skopje">Central European Time (CET) - Skopje</option>
                                <option value="Europe/Tirana">Central European Time (CET) - Tirana</option>
                                <option value="Europe/Athens">Eastern European Time (EET) - Athens</option>
                                <option value="Europe/Bucharest">Eastern European Time (EET) - Bucharest</option>
                                <option value="Europe/Sofia">Eastern European Time (EET) - Sofia</option>
                                <option value="Europe/Helsinki">Eastern European Time (EET) - Helsinki</option>
                                <option value="Europe/Kiev">Eastern European Time (EET) - Kiev</option>
                                <option value="Europe/Minsk">Moscow Time (MSK) - Minsk</option>
                                <option value="Europe/Moscow">Moscow Time (MSK) - Moscow</option>
                              </optgroup>
                              
                              <optgroup label="Europe - Northern">
                                <option value="Europe/Stockholm">Central European Time (CET) - Stockholm</option>
                                <option value="Europe/Oslo">Central European Time (CET) - Oslo</option>
                                <option value="Europe/Copenhagen">Central European Time (CET) - Copenhagen</option>
                                <option value="Europe/Reykjavik">Greenwich Mean Time (GMT) - Reykjavik</option>
                              </optgroup>
                              
                              <optgroup label="Asia - Eastern">
                                <option value="Asia/Tokyo">Japan Standard Time (JST) - Tokyo</option>
                                <option value="Asia/Seoul">Korea Standard Time (KST) - Seoul</option>
                                <option value="Asia/Shanghai">China Standard Time (CST) - Shanghai</option>
                                <option value="Asia/Beijing">China Standard Time (CST) - Beijing</option>
                                <option value="Asia/Hong_Kong">Hong Kong Time (HKT) - Hong Kong</option>
                                <option value="Asia/Taipei">Taiwan Time (CST) - Taipei</option>
                                <option value="Asia/Macau">Macau Time (CST) - Macau</option>
                                <option value="Asia/Ulaanbaatar">Ulaanbaatar Time (ULAT) - Ulaanbaatar</option>
                              </optgroup>
                              
                              <optgroup label="Asia - Southeast">
                                <option value="Asia/Bangkok">Indochina Time (ICT) - Bangkok</option>
                                <option value="Asia/Ho_Chi_Minh">Indochina Time (ICT) - Ho Chi Minh City</option>
                                <option value="Asia/Jakarta">Western Indonesia Time (WIB) - Jakarta</option>
                                <option value="Asia/Makassar">Central Indonesia Time (WITA) - Makassar</option>
                                <option value="Asia/Jayapura">Eastern Indonesia Time (WIT) - Jayapura</option>
                                <option value="Asia/Manila">Philippine Time (PHT) - Manila</option>
                                <option value="Asia/Kuala_Lumpur">Malaysia Time (MYT) - Kuala Lumpur</option>
                                <option value="Asia/Singapore">Singapore Time (SGT) - Singapore</option>
                                <option value="Asia/Brunei">Brunei Time (BNT) - Bandar Seri Begawan</option>
                              </optgroup>
                              
                              <optgroup label="Asia - South">
                                <option value="Asia/Kolkata">India Standard Time (IST) - Kolkata</option>
                                <option value="Asia/Mumbai">India Standard Time (IST) - Mumbai</option>
                                <option value="Asia/Delhi">India Standard Time (IST) - Delhi</option>
                                <option value="Asia/Karachi">Pakistan Standard Time (PKT) - Karachi</option>
                                <option value="Asia/Dhaka">Bangladesh Standard Time (BST) - Dhaka</option>
                                <option value="Asia/Kathmandu">Nepal Time (NPT) - Kathmandu</option>
                                <option value="Asia/Colombo">Sri Lanka Time (SLST) - Colombo</option>
                                <option value="Asia/Kabul">Afghanistan Time (AFT) - Kabul</option>
                              </optgroup>
                              
                              <optgroup label="Asia - Central">
                                <option value="Asia/Tashkent">Uzbekistan Time (UZT) - Tashkent</option>
                                <option value="Asia/Almaty">Almaty Time (ALMT) - Almaty</option>
                                <option value="Asia/Aqtobe">Aqtobe Time (AQTT) - Aqtobe</option>
                                <option value="Asia/Aqtau">Aqtau Time (AQTT) - Aqtau</option>
                                <option value="Asia/Oral">Oral Time (ORAT) - Oral</option>
                                <option value="Asia/Qyzylorda">Qyzylorda Time (QYZT) - Qyzylorda</option>
                                <option value="Asia/Bishkek">Kyrgyzstan Time (KGT) - Bishkek</option>
                                <option value="Asia/Dushanbe">Tajikistan Time (TJT) - Dushanbe</option>
                                <option value="Asia/Ashgabat">Turkmenistan Time (TMT) - Ashgabat</option>
                              </optgroup>
                              
                              <optgroup label="Asia - Middle East">
                                <option value="Asia/Dubai">Gulf Standard Time (GST) - Dubai</option>
                                <option value="Asia/Muscat">Gulf Standard Time (GST) - Muscat</option>
                                <option value="Asia/Kuwait">Arabia Standard Time (AST) - Kuwait</option>
                                <option value="Asia/Riyadh">Arabia Standard Time (AST) - Riyadh</option>
                                <option value="Asia/Bahrain">Arabia Standard Time (AST) - Bahrain</option>
                                <option value="Asia/Qatar">Arabia Standard Time (AST) - Qatar</option>
                                <option value="Asia/Tehran">Iran Standard Time (IRST) - Tehran</option>
                                <option value="Asia/Baghdad">Arabia Standard Time (AST) - Baghdad</option>
                                <option value="Asia/Damascus">Eastern European Time (EET) - Damascus</option>
                                <option value="Asia/Beirut">Eastern European Time (EET) - Beirut</option>
                                <option value="Asia/Jerusalem">Israel Standard Time (IST) - Jerusalem</option>
                                <option value="Asia/Amman">Eastern European Time (EET) - Amman</option>
                                <option value="Asia/Istanbul">Turkey Time (TRT) - Istanbul</option>
                              </optgroup>
                              
                              <optgroup label="Africa - Northern">
                                <option value="Africa/Cairo">Eastern European Time (EET) - Cairo</option>
                                <option value="Africa/Tripoli">Eastern European Time (EET) - Tripoli</option>
                                <option value="Africa/Tunis">Central European Time (CET) - Tunis</option>
                                <option value="Africa/Algiers">Central European Time (CET) - Algiers</option>
                                <option value="Africa/Casablanca">Western European Time (WET) - Casablanca</option>
                              </optgroup>
                              
                              <optgroup label="Africa - Western">
                                <option value="Africa/Lagos">West Africa Time (WAT) - Lagos</option>
                                <option value="Africa/Accra">Greenwich Mean Time (GMT) - Accra</option>
                                <option value="Africa/Abidjan">Greenwich Mean Time (GMT) - Abidjan</option>
                                <option value="Africa/Dakar">Greenwich Mean Time (GMT) - Dakar</option>
                                <option value="Africa/Bamako">Greenwich Mean Time (GMT) - Bamako</option>
                                <option value="Africa/Ouagadougou">Greenwich Mean Time (GMT) - Ouagadougou</option>
                                <option value="Africa/Niamey">West Africa Time (WAT) - Niamey</option>
                                <option value="Africa/Nouakchott">Greenwich Mean Time (GMT) - Nouakchott</option>
                              </optgroup>
                              
                              <optgroup label="Africa - Central">
                                <option value="Africa/Kinshasa">West Africa Time (WAT) - Kinshasa</option>
                                <option value="Africa/Lubumbashi">Central Africa Time (CAT) - Lubumbashi</option>
                                <option value="Africa/Brazzaville">West Africa Time (WAT) - Brazzaville</option>
                                <option value="Africa/Bangui">West Africa Time (WAT) - Bangui</option>
                                <option value="Africa/Ndjamena">West Africa Time (WAT) - N'Djamena</option>
                                <option value="Africa/Douala">West Africa Time (WAT) - Douala</option>
                                <option value="Africa/Malabo">West Africa Time (WAT) - Malabo</option>
                                <option value="Africa/Libreville">West Africa Time (WAT) - Libreville</option>
                              </optgroup>
                              
                              <optgroup label="Africa - Eastern">
                                <option value="Africa/Nairobi">East Africa Time (EAT) - Nairobi</option>
                                <option value="Africa/Kampala">East Africa Time (EAT) - Kampala</option>
                                <option value="Africa/Dar_es_Salaam">East Africa Time (EAT) - Dar es Salaam</option>
                                <option value="Africa/Kigali">Central Africa Time (CAT) - Kigali</option>
                                <option value="Africa/Bujumbura">Central Africa Time (CAT) - Bujumbura</option>
                                <option value="Africa/Addis_Ababa">East Africa Time (EAT) - Addis Ababa</option>
                                <option value="Africa/Asmara">East Africa Time (EAT) - Asmara</option>
                                <option value="Africa/Djibouti">East Africa Time (EAT) - Djibouti</option>
                                <option value="Africa/Mogadishu">East Africa Time (EAT) - Mogadishu</option>
                              </optgroup>
                              
                              <optgroup label="Africa - Southern">
                                <option value="Africa/Johannesburg">South Africa Standard Time (SAST) - Johannesburg</option>
                                <option value="Africa/Cape_Town">South Africa Standard Time (SAST) - Cape Town</option>
                                <option value="Africa/Windhoek">Central Africa Time (CAT) - Windhoek</option>
                                <option value="Africa/Gaborone">Central Africa Time (CAT) - Gaborone</option>
                                <option value="Africa/Harare">Central Africa Time (CAT) - Harare</option>
                                <option value="Africa/Lusaka">Central Africa Time (CAT) - Lusaka</option>
                                <option value="Africa/Maputo">Central Africa Time (CAT) - Maputo</option>
                                <option value="Africa/Luanda">West Africa Time (WAT) - Luanda</option>
                              </optgroup>
                              
                              <optgroup label="Australia - Eastern">
                                <option value="Australia/Sydney">Australian Eastern Time (AEST) - Sydney</option>
                                <option value="Australia/Melbourne">Australian Eastern Time (AEST) - Melbourne</option>
                                <option value="Australia/Brisbane">Australian Eastern Time (AEST) - Brisbane</option>
                                <option value="Australia/Hobart">Australian Eastern Time (AEST) - Hobart</option>
                                <option value="Australia/Adelaide">Australian Central Time (ACST) - Adelaide</option>
                                <option value="Australia/Darwin">Australian Central Time (ACST) - Darwin</option>
                                <option value="Australia/Perth">Australian Western Time (AWST) - Perth</option>
                              </optgroup>
                              
                              <optgroup label="Pacific">
                                <option value="Pacific/Auckland">New Zealand Time (NZST) - Auckland</option>
                                <option value="Pacific/Fiji">Fiji Time (FJT) - Suva</option>
                                <option value="Pacific/Port_Moresby">Papua New Guinea Time (PGT) - Port Moresby</option>
                                <option value="Pacific/Guadalcanal">Solomon Islands Time (SBT) - Guadalcanal</option>
                                <option value="Pacific/Noumea">New Caledonia Time (NCT) - Nouméa</option>
                                <option value="Pacific/Tahiti">Tahiti Time (TAHT) - Tahiti</option>
                                <option value="Pacific/Apia">Samoa Time (WST) - Apia</option>
                                <option value="Pacific/Tongatapu">Tonga Time (TOT) - Nuku'alofa</option>
                                <option value="Pacific/Kiritimati">Line Islands Time (LINT) - Kiritimati</option>
                                <option value="Pacific/Majuro">Marshall Islands Time (MHT) - Majuro</option>
                                <option value="Pacific/Kwajalein">Marshall Islands Time (MHT) - Kwajalein</option>
                                <option value="Pacific/Palau">Palau Time (PWT) - Koror</option>
                                <option value="Pacific/Chuuk">Chuuk Time (CHUT) - Chuuk</option>
                                <option value="Pacific/Pohnpei">Pohnpei Time (PONT) - Pohnpei</option>
                                <option value="Pacific/Kosrae">Kosrae Time (KOST) - Kosrae</option>
                                <option value="Pacific/Nauru">Nauru Time (NRT) - Yaren</option>
                                <option value="Pacific/Tarawa">Gilbert Islands Time (GILT) - Tarawa</option>
                                <option value="Pacific/Funafuti">Tuvalu Time (TVT) - Funafuti</option>
                                <option value="Pacific/Niue">Niue Time (NUT) - Alofi</option>
                                <option value="Pacific/Rarotonga">Cook Islands Time (CKT) - Rarotonga</option>
                              </optgroup>
                              
                              <optgroup label="Atlantic">
                                <option value="Atlantic/Reykjavik">Greenwich Mean Time (GMT) - Reykjavik</option>
                                <option value="Atlantic/Azores">Azores Time (AZOT) - Azores</option>
                                <option value="Atlantic/Madeira">Western European Time (WET) - Madeira</option>
                                <option value="Atlantic/Canary">Western European Time (WET) - Canary Islands</option>
                                <option value="Atlantic/Cape_Verde">Cape Verde Time (CVT) - Praia</option>
                                <option value="Atlantic/St_Helena">Greenwich Mean Time (GMT) - St. Helena</option>
                                <option value="Atlantic/South_Georgia">South Georgia Time (GST) - South Georgia</option>
                                <option value="Atlantic/Bermuda">Atlantic Time (AST) - Bermuda</option>
                              </optgroup>
                              
                              <optgroup label="Indian Ocean">
                                <option value="Indian/Maldives">Maldives Time (MVT) - Malé</option>
                                <option value="Indian/Mauritius">Mauritius Time (MUT) - Port Louis</option>
                                <option value="Indian/Reunion">Réunion Time (RET) - Saint-Denis</option>
                                <option value="Indian/Seychelles">Seychelles Time (SCT) - Victoria</option>
                                <option value="Indian/Comoro">East Africa Time (EAT) - Moroni</option>
                                <option value="Indian/Mayotte">East Africa Time (EAT) - Mamoudzou</option>
                                <option value="Indian/Antananarivo">East Africa Time (EAT) - Antananarivo</option>
                                <option value="Indian/Mahe">Seychelles Time (SCT) - Victoria</option>
                                <option value="Indian/Kerguelen">French Southern Time (TFT) - Kerguelen</option>
                                <option value="Indian/Chagos">Indian Ocean Time (IOT) - Diego Garcia</option>
                                <option value="Indian/Cocos">Cocos Islands Time (CCT) - West Island</option>
                                <option value="Indian/Christmas">Christmas Island Time (CXT) - Flying Fish Cove</option>
                              </optgroup>
                            </select>
                          </div>

                          <div className="col-md-6 mb-3">
                            <label htmlFor="dateFormat" className="form-label">
                              <Calendar className="h-4 w-4 me-1" />
                              Date Format
                            </label>
                            <select
                              className="form-select"
                              id="dateFormat"
                              value={timeRegionSettings.dateFormat}
                              onChange={(e) => handleTimeRegionChange('dateFormat', e.target.value)}
                            >
                              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                              <option value="DD/MM/YYYY">DD/MM/YYYY (EU)</option>
                              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                              <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                              <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                            </select>
                          </div>

                          <div className="col-md-6 mb-3">
                            <label htmlFor="timeFormat" className="form-label">
                              <Clock className="h-4 w-4 me-1" />
                              Time Format
                            </label>
                            <select
                              className="form-select"
                              id="timeFormat"
                              value={timeRegionSettings.timeFormat}
                              onChange={(e) => handleTimeRegionChange('timeFormat', e.target.value)}
                            >
                              <option value="12h">12-hour (AM/PM)</option>
                              <option value="24h">24-hour</option>
                            </select>
                          </div>

                          <div className="col-md-6 mb-3">
                            <label htmlFor="currency" className="form-label">
                              <DollarSign className="h-4 w-4 me-1" />
                              Currency
                            </label>
                            <select
                              className="form-select"
                              id="currency"
                              value={timeRegionSettings.currency}
                              onChange={(e) => handleTimeRegionChange('currency', e.target.value)}
                            >
                              <option value="USD">USD - US Dollar</option>
                              <option value="EUR">EUR - Euro</option>
                              <option value="GBP">GBP - British Pound Sterling</option>
                              <option value="JPY">JPY - Japanese Yen</option>
                              <option value="BRL">BRL - Brazilian Real</option>
                              <option value="CAD">CAD - Canadian Dollar</option>
                            </select>
                          </div>

                          <div className="col-md-6 mb-3">
                            <label htmlFor="language" className="form-label">
                              <Globe className="h-4 w-4 me-1" />
                              Language
                            </label>
                            <select
                              className="form-select"
                              id="language"
                              value={timeRegionSettings.language}
                              onChange={(e) => handleTimeRegionChange('language', e.target.value)}
                            >
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                              <option value="it">Italian</option>
                              <option value="pt">Portuguese</option>
                            </select>
                          </div>

                          <div className="col-md-6 mb-3">
                            <label htmlFor="country" className="form-label">
                              <Map className="h-4 w-4 me-1" />
                              Country
                            </label>
                            <select
                              className="form-select"
                              id="country"
                              value={timeRegionSettings.country}
                              onChange={(e) => handleTimeRegionChange('country', e.target.value)}
                            >
                              <optgroup label="North America">
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="MX">Mexico</option>
                                <option value="GT">Guatemala</option>
                                <option value="BZ">Belize</option>
                                <option value="SV">El Salvador</option>
                                <option value="HN">Honduras</option>
                                <option value="NI">Nicaragua</option>
                                <option value="CR">Costa Rica</option>
                                <option value="PA">Panama</option>
                                <option value="CU">Cuba</option>
                                <option value="JM">Jamaica</option>
                                <option value="HT">Haiti</option>
                                <option value="DO">Dominican Republic</option>
                                <option value="BS">Bahamas</option>
                                <option value="BB">Barbados</option>
                                <option value="TT">Trinidad and Tobago</option>
                                <option value="AG">Antigua and Barbuda</option>
                                <option value="DM">Dominica</option>
                                <option value="GD">Grenada</option>
                                <option value="KN">Saint Kitts and Nevis</option>
                                <option value="LC">Saint Lucia</option>
                                <option value="VC">Saint Vincent and the Grenadines</option>
                              </optgroup>
                              
                              <optgroup label="South America">
                                <option value="BR">Brazil</option>
                                <option value="AR">Argentina</option>
                                <option value="CL">Chile</option>
                                <option value="CO">Colombia</option>
                                <option value="PE">Peru</option>
                                <option value="VE">Venezuela</option>
                                <option value="EC">Ecuador</option>
                                <option value="BO">Bolivia</option>
                                <option value="PY">Paraguay</option>
                                <option value="UY">Uruguay</option>
                                <option value="GY">Guyana</option>
                                <option value="SR">Suriname</option>
                                <option value="FK">Falkland Islands</option>
                                <option value="GF">French Guiana</option>
                              </optgroup>
                              
                              <optgroup label="Europe">
                                <option value="GB">United Kingdom</option>
                                <option value="IE">Ireland</option>
                                <option value="FR">France</option>
                                <option value="DE">Germany</option>
                                <option value="IT">Italy</option>
                                <option value="ES">Spain</option>
                                <option value="PT">Portugal</option>
                                <option value="NL">Netherlands</option>
                                <option value="BE">Belgium</option>
                                <option value="CH">Switzerland</option>
                                <option value="AT">Austria</option>
                                <option value="CZ">Czech Republic</option>
                                <option value="PL">Poland</option>
                                <option value="HU">Hungary</option>
                                <option value="SK">Slovakia</option>
                                <option value="SI">Slovenia</option>
                                <option value="HR">Croatia</option>
                                <option value="BA">Bosnia and Herzegovina</option>
                                <option value="RS">Serbia</option>
                                <option value="ME">Montenegro</option>
                                <option value="MK">North Macedonia</option>
                                <option value="AL">Albania</option>
                                <option value="GR">Greece</option>
                                <option value="RO">Romania</option>
                                <option value="BG">Bulgaria</option>
                                <option value="FI">Finland</option>
                                <option value="SE">Sweden</option>
                                <option value="NO">Norway</option>
                                <option value="DK">Denmark</option>
                                <option value="IS">Iceland</option>
                                <option value="EE">Estonia</option>
                                <option value="LV">Latvia</option>
                                <option value="LT">Lithuania</option>
                                <option value="BY">Belarus</option>
                                <option value="UA">Ukraine</option>
                                <option value="RU">Russia</option>
                                <option value="MD">Moldova</option>
                                <option value="LU">Luxembourg</option>
                                <option value="LI">Liechtenstein</option>
                                <option value="MC">Monaco</option>
                                <option value="SM">San Marino</option>
                                <option value="VA">Vatican City</option>
                                <option value="AD">Andorra</option>
                                <option value="MT">Malta</option>
                                <option value="CY">Cyprus</option>
                              </optgroup>
                              
                              <optgroup label="Asia">
                                <option value="CN">China</option>
                                <option value="JP">Japan</option>
                                <option value="KR">South Korea</option>
                                <option value="KP">North Korea</option>
                                <option value="TW">Taiwan</option>
                                <option value="HK">Hong Kong</option>
                                <option value="MO">Macau</option>
                                <option value="MN">Mongolia</option>
                                <option value="TH">Thailand</option>
                                <option value="VN">Vietnam</option>
                                <option value="LA">Laos</option>
                                <option value="KH">Cambodia</option>
                                <option value="MY">Malaysia</option>
                                <option value="SG">Singapore</option>
                                <option value="ID">Indonesia</option>
                                <option value="PH">Philippines</option>
                                <option value="BN">Brunei</option>
                                <option value="MM">Myanmar</option>
                                <option value="BD">Bangladesh</option>
                                <option value="IN">India</option>
                                <option value="PK">Pakistan</option>
                                <option value="LK">Sri Lanka</option>
                                <option value="MV">Maldives</option>
                                <option value="NP">Nepal</option>
                                <option value="BT">Bhutan</option>
                                <option value="AF">Afghanistan</option>
                                <option value="IR">Iran</option>
                                <option value="IQ">Iraq</option>
                                <option value="SY">Syria</option>
                                <option value="LB">Lebanon</option>
                                <option value="JO">Jordan</option>
                                <option value="IL">Israel</option>
                                <option value="PS">Palestine</option>
                                <option value="SA">Saudi Arabia</option>
                                <option value="AE">United Arab Emirates</option>
                                <option value="QA">Qatar</option>
                                <option value="BH">Bahrain</option>
                                <option value="KW">Kuwait</option>
                                <option value="OM">Oman</option>
                                <option value="YE">Yemen</option>
                                <option value="TR">Turkey</option>
                                <option value="GE">Georgia</option>
                                <option value="AM">Armenia</option>
                                <option value="AZ">Azerbaijan</option>
                                <option value="KZ">Kazakhstan</option>
                                <option value="UZ">Uzbekistan</option>
                                <option value="TM">Turkmenistan</option>
                                <option value="TJ">Tajikistan</option>
                                <option value="KG">Kyrgyzstan</option>
                              </optgroup>
                              
                              <optgroup label="Africa">
                                <option value="EG">Egypt</option>
                                <option value="LY">Libya</option>
                                <option value="TN">Tunisia</option>
                                <option value="DZ">Algeria</option>
                                <option value="MA">Morocco</option>
                                <option value="SD">Sudan</option>
                                <option value="SS">South Sudan</option>
                                <option value="ET">Ethiopia</option>
                                <option value="ER">Eritrea</option>
                                <option value="DJ">Djibouti</option>
                                <option value="SO">Somalia</option>
                                <option value="KE">Kenya</option>
                                <option value="UG">Uganda</option>
                                <option value="TZ">Tanzania</option>
                                <option value="RW">Rwanda</option>
                                <option value="BI">Burundi</option>
                                <option value="CD">Democratic Republic of the Congo</option>
                                <option value="CG">Republic of the Congo</option>
                                <option value="CF">Central African Republic</option>
                                <option value="TD">Chad</option>
                                <option value="CM">Cameroon</option>
                                <option value="GQ">Equatorial Guinea</option>
                                <option value="GA">Gabon</option>
                                <option value="ST">São Tomé and Príncipe</option>
                                <option value="AO">Angola</option>
                                <option value="ZM">Zambia</option>
                                <option value="ZW">Zimbabwe</option>
                                <option value="BW">Botswana</option>
                                <option value="NA">Namibia</option>
                                <option value="ZA">South Africa</option>
                                <option value="LS">Lesotho</option>
                                <option value="SZ">Eswatini</option>
                                <option value="MG">Madagascar</option>
                                <option value="MU">Mauritius</option>
                                <option value="SC">Seychelles</option>
                                <option value="KM">Comoros</option>
                                <option value="YT">Mayotte</option>
                                <option value="RE">Réunion</option>
                                <option value="MZ">Mozambique</option>
                                <option value="MW">Malawi</option>
                                <option value="GH">Ghana</option>
                                <option value="TG">Togo</option>
                                <option value="BJ">Benin</option>
                                <option value="NG">Nigeria</option>
                                <option value="NE">Niger</option>
                                <option value="BF">Burkina Faso</option>
                                <option value="ML">Mali</option>
                                <option value="SN">Senegal</option>
                                <option value="GM">Gambia</option>
                                <option value="GW">Guinea-Bissau</option>
                                <option value="GN">Guinea</option>
                                <option value="SL">Sierra Leone</option>
                                <option value="LR">Liberia</option>
                                <option value="CI">Ivory Coast</option>
                                <option value="GH">Ghana</option>
                                <option value="MR">Mauritania</option>
                                <option value="CV">Cape Verde</option>
                              </optgroup>
                              
                              <optgroup label="Oceania">
                                <option value="AU">Australia</option>
                                <option value="NZ">New Zealand</option>
                                <option value="FJ">Fiji</option>
                                <option value="PG">Papua New Guinea</option>
                                <option value="SB">Solomon Islands</option>
                                <option value="VU">Vanuatu</option>
                                <option value="NC">New Caledonia</option>
                                <option value="PF">French Polynesia</option>
                                <option value="WS">Samoa</option>
                                <option value="TO">Tonga</option>
                                <option value="KI">Kiribati</option>
                                <option value="TV">Tuvalu</option>
                                <option value="NR">Nauru</option>
                                <option value="MH">Marshall Islands</option>
                                <option value="FM">Micronesia</option>
                                <option value="PW">Palau</option>
                                <option value="AS">American Samoa</option>
                                <option value="GU">Guam</option>
                                <option value="MP">Northern Mariana Islands</option>
                                <option value="CK">Cook Islands</option>
                                <option value="NU">Niue</option>
                                <option value="TK">Tokelau</option>
                                <option value="WF">Wallis and Futuna</option>
                                <option value="PN">Pitcairn Islands</option>
                                <option value="NF">Norfolk Island</option>
                                <option value="CX">Christmas Island</option>
                                <option value="CC">Cocos Islands</option>
                              </optgroup>
                            </select>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end">
                          <button className="btn btn-primary" onClick={handleSaveTimeRegion}>
                            <Save className="h-4 w-4 me-2" />
                            Save Time & Region Settings
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="mb-4">
                        <h6 className="mb-3">Current Settings</h6>
                        <div className="d-flex align-items-center mb-3">
                          <div className="avatar avatar-sm me-3">
                            <span className="avatar-initial rounded bg-label-primary">
                              <Clock className="h-4 w-4" />
                            </span>
                          </div>
                          <div>
                            <p className="mb-0 fw-semibold">Timezone</p>
                            <small className="text-muted">{timeRegionSettings.timezone}</small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                          <div className="avatar avatar-sm me-3">
                            <span className="avatar-initial rounded bg-label-success">
                              <Calendar className="h-4 w-4" />
                            </span>
                          </div>
                          <div>
                            <p className="mb-0 fw-semibold">Date Format</p>
                            <small className="text-muted">{timeRegionSettings.dateFormat}</small>
                      </div>
                    </div>
                        <div className="d-flex align-items-center mb-3">
                          <div className="avatar avatar-sm me-3">
                            <span className="avatar-initial rounded bg-label-info">
                              <DollarSign className="h-4 w-4" />
                            </span>
                  </div>
                          <div>
                            <p className="mb-0 fw-semibold">Currency</p>
                            <small className="text-muted">{timeRegionSettings.currency}</small>
                </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-sm me-3">
                            <span className="avatar-initial rounded bg-label-warning">
                              <Globe className="h-4 w-4" />
                            </span>
                          </div>
                          <div>
                            <p className="mb-0 fw-semibold">Language</p>
                            <small className="text-muted">{timeRegionSettings.language.toUpperCase()}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tab-pane fade" id="general" role="tabpanel">
                  <div className="row">
                    <div className="col-lg-8 mb-4">
                      <div className="mb-4">
                        <h5 className="mb-2 d-flex align-items-center">
                            <Database className="h-5 w-5 me-2 text-primary" />
                            Data Storage Configuration
                          </h5>
                        <p className="text-muted small mb-3">Choose how your data is stored and managed</p>
                          <div className="row">
                            <div className="col-md-6 mb-4">
                              <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center">
                                  <div className="avatar avatar-xl mx-auto mb-3">
                                  <span className="avatar-initial rounded bg-label-primary">
                                      <Server className="h-6 w-6" />
                                    </span>
                                  </div>
                                  <h6 className="mb-2">Local Storage</h6>
                                <p className="text-muted small mb-3">Store data in your browser's local storage</p>
                                  <div className="form-check d-flex justify-content-center">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="storage"
                                      id="local"
                                      value="local"
                                      checked={currentAdapter === 'local'}
                                      onChange={() => handleAdapterChange('local')}
                                    />
                                    <label className="form-check-label ms-2" htmlFor="local">
                                      Use Local Storage
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 mb-4">
                              <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center">
                                  <div className="avatar avatar-xl mx-auto mb-3">
                                    <span className="avatar-initial rounded bg-label-success">
                                      <Globe className="h-6 w-6" />
                                    </span>
                                  </div>
                                  <h6 className="mb-2">Supabase Cloud</h6>
                                  <p className="text-muted small mb-3">Store data in the cloud</p>
                                  <div className="form-check d-flex justify-content-center">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="storage"
                                      id="supabase"
                                      value="supabase"
                                      checked={currentAdapter === 'supabase'}
                                      onChange={() => handleAdapterChange('supabase')}
                                    />
                                    <label className="form-check-label ms-2" htmlFor="supabase">
                                      Use Supabase
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {currentAdapter === 'supabase' && (
                            <div className="mt-4">
                              <h6 className="mb-3 d-flex align-items-center">
                                <Key className="h-4 w-4 me-2" />
                                Supabase Configuration
                              </h6>
                              <div className="row">
                                <div className="col-md-6 mb-3">
                                  <label htmlFor="supabase-url" className="form-label">Project URL</label>
                                  <input
                                    type="url"
                                    className="form-control"
                                    id="supabase-url"
                                    value={supabaseUrl}
                                    onChange={(e) => setSupabaseUrl(e.target.value)}
                                  placeholder="e.g., https://your-project-id.supabase.co"
                                  />
                                </div>
                                <div className="col-md-6 mb-3">
                                  <label htmlFor="supabase-key" className="form-label">Anon Key</label>
                                  <input
                                  type="text"
                                    className="form-control"
                                    id="supabase-key"
                                    value={supabaseKey}
                                    onChange={(e) => setSupabaseKey(e.target.value)}
                                    placeholder="Your Supabase anon key"
                                  />
                                </div>
                              </div>
                            <div className="d-flex justify-content-end">
                              <button className="btn btn-primary" onClick={handleSaveSupabase}>
                                <Save className="h-4 w-4 me-2" />
                                Save Supabase Config
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tab-pane fade" id="integration" role="tabpanel">
                  <IntegrationSettings />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}