
  Pod::Spec.new do |s|
    s.name = 'WalletActorSystemCapacitorBinding'
    s.version = '0.0.1'
    s.summary = 'Capacitor binding to the Wallet\'s actor system'
    s.license = 'MIT'
    s.homepage = 'https://github.com/iotaledger/wallet-spec'
    s.author = 'Lucas Nogueira <lucas.nogueira@iota.org>'
    s.source = { :git => 'https://github.com/iotaledger/wallet-spec', :tag => s.version.to_s }
    s.source_files = 'ios/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
    s.ios.deployment_target  = '11.0'
    s.dependency 'Capacitor'
    s.vendored_libraries = ['ios/Plugin/Libraries/libwallet.a']
    s.platform = :ios, "11.0"
    s.xcconfig = { 'SWIFT_INCLUDE_PATHS' => '$(PODS_TARGET_SRCROOT)/ios/Plugin/Libraries' }
    s.preserve_paths = ['ios/Plugin/Libraries/module.modulemap']
  end
