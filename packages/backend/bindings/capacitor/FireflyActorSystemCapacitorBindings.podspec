
  Pod::Spec.new do |s|
    s.name = 'FireflyActorSystemCapacitorBindings'
    s.version = '0.0.1'
    s.summary = 'Capacitor binding to the Wallet\'s actor system'
    s.license = { :type => 'MIT' }
    s.homepage = 'https://github.com/iotaledger/firefly'
    s.author = 'IOTA Stiftung'
    s.source = { :git => 'https://github.com/iotaledger/firefly.git', :tag => s.version.to_s }
    s.source_files = 'ios/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
    s.ios.deployment_target  = '12.0'
    s.dependency 'Capacitor'
    #s.vendored_libraries = ['ios/Plugin/Libraries/libwallet.a']
    s.pod_target_xcconfig = { 
      'OTHER_LDFLAGS' => '-lc++',
      'ENABLE_BITCODE' => '$(ENABLE_BITCODE_$(CONFIGURATION))',
      'ENABLE_BITCODE_Release' => 'NO', 
      'ENABLE_BITCODE_Debug' => 'YES'
    }
    s.weak_frameworks = 'IOTAWalletInternal'
    s.platform = :ios, "12.0"
    s.xcconfig = { 'SWIFT_INCLUDE_PATHS' => '$(PODS_TARGET_SRCROOT)/ios/Plugin/Libraries' }
    s.preserve_paths = ['ios/Plugin/Libraries/module.modulemap']
  end
