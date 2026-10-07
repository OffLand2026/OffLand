# Fügt dem Xcode-Projekt die Bildschirmzeit-Teile hinzu (einmalig ausgeführt, Ergebnis ist eingecheckt).
# Aufruf: ruby scripts/add-screentime-target.rb   (braucht: gem install xcodeproj)
require "xcodeproj"

path = File.join(__dir__, "..", "ios", "App", "App.xcodeproj")
project = Xcodeproj::Project.open(path)
app = project.targets.find { |t| t.name == "App" } or abort "App-Target fehlt"
abort "ScreenTimeMonitor gibt es schon" if project.targets.any? { |t| t.name == "ScreenTimeMonitor" }

# 1) Neue Swift-Dateien und Entitlements der App
app_group = project.main_group["App"]
%w[MainViewController.swift ScreenTimePlugin.swift].each do |f|
  ref = app_group.new_reference(f)
  app.source_build_phase.add_file_reference(ref)
end
app_group.new_reference("App.entitlements")
app.build_configurations.each do |c|
  c.build_settings["CODE_SIGN_ENTITLEMENTS"] = "App/App.entitlements"
end

# 2) Monitor-Erweiterung
ext = project.new_target(:app_extension, "ScreenTimeMonitor", :ios, "16.0", nil, :swift)
grp = project.main_group.new_group("ScreenTimeMonitor", "ScreenTimeMonitor")
ext.source_build_phase.add_file_reference(grp.new_reference("MonitorExtension.swift"))
grp.new_reference("Info.plist")
grp.new_reference("ScreenTimeMonitor.entitlements")
ext.build_configurations.each do |c|
  s = c.build_settings
  s["PRODUCT_BUNDLE_IDENTIFIER"] = "com.offland2026.offland.ScreenTimeMonitor"
  s["PRODUCT_NAME"] = "$(TARGET_NAME)"
  s["INFOPLIST_FILE"] = "ScreenTimeMonitor/Info.plist"
  s["CODE_SIGN_ENTITLEMENTS"] = "ScreenTimeMonitor/ScreenTimeMonitor.entitlements"
  s["SWIFT_VERSION"] = "5.0"
  s["IPHONEOS_DEPLOYMENT_TARGET"] = "16.0"
  s["TARGETED_DEVICE_FAMILY"] = "1,2"
  s["MARKETING_VERSION"] = "1.0"
  s["CURRENT_PROJECT_VERSION"] = "1"
  s["SKIP_INSTALL"] = "YES"
  s["GENERATE_INFOPLIST_FILE"] = "NO"
  s["LD_RUNPATH_SEARCH_PATHS"] = ["$(inherited)", "@executable_path/Frameworks", "@executable_path/../../Frameworks"]
  s["CODE_SIGN_STYLE"] = "Automatic"
end
%w[DeviceActivity.framework].each do |fw|
  ref = project.frameworks_group.new_file("System/Library/Frameworks/#{fw}", :sdk_root)
  ext.frameworks_build_phase.add_file_reference(ref)
end

# 3) Erweiterung in die App einbetten
app.add_dependency(ext)
embed = app.new_copy_files_build_phase("Embed Foundation Extensions")
embed.symbol_dst_subfolder_spec = :plug_ins
bf = embed.add_file_reference(ext.product_reference)
bf.settings = { "ATTRIBUTES" => ["RemoveHeadersOnCopy"] }

project.save
puts "ScreenTimeMonitor hinzugefügt"
