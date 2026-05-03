const I18N={
      vi:{menuDashboard:'Dashboard',menuVideo:'Video',menuSystem:'System',navOverview:'Tổng quan',navHistory:'Logs',navImport:'Import / Upload Video',navLibrary:'Danh sách Video',navSettings:'Lưu Trữ',navConfig:'Cấu Hình',navAccount:'Tài Khoản',logout:'Đăng xuất',heroBadge:'☁️ DASHBOARD TỔNG QUAN',heroTitle:'Tổng quan hệ thống',heroDesc:'Quản lý nhanh toàn bộ luồng upload, lưu trữ và phát video.',page:{overview:'Tổng quan',history:'Logs',import:'Import / Upload Video',library:'Danh sách Video',settings:'Lưu Trữ',config:'Cấu Hình',account:'Tài Khoản'}},
      en:{menuDashboard:'Dashboard',menuVideo:'Video',menuSystem:'System',navOverview:'Overview',navHistory:'Logs',navImport:'Import / Upload Video',navLibrary:'Video Library',navSettings:'Storage',navConfig:'Configuration',navAccount:'Account',logout:'Logout',heroBadge:'☁️ OVERVIEW DASHBOARD',heroTitle:'System Overview',heroDesc:'Quickly manage upload, storage and video delivery workflows.',page:{overview:'Overview',history:'Logs',import:'Import / Upload Video',library:'Video Library',settings:'Storage',config:'Configuration',account:'Account'}}
    };
    const I18N_PHRASES_EN={
      'Tổng quan hệ thống':'System Overview','Tổng quan':'Overview','Danh sách Video':'Video Library','Lưu Trữ':'Storage','Cấu Hình':'Configuration','Tài Khoản':'Account','Đăng xuất':'Logout',
      'Sửa preset':'Edit preset','Chỉnh preset':'Edit preset','Tool hệ thống':'System Tools','Storage Check':'Storage Check','Import / Upload Video':'Import / Upload Video','Nguồn video':'Video source','Chọn từ link':'Select from URL','Chọn video từ máy':'Select local video',
      'Đang tải...':'Loading...','Không có':'N/A','Xem log':'View logs','Trung tâm điều khiển':'Control Center','Preset upload mặc định':'Default upload preset','Đang áp dụng':'Active','Home':'Home',
      'Quản lý nhanh toàn bộ luồng upload, lưu trữ và phát video.':'Quickly manage upload, storage and video delivery workflows.',
      'CPU hệ thống':'System CPU','RAM hệ thống':'System RAM','Mức sử dụng CPU hiện tại':'Current CPU usage','Mức sử dụng RAM hiện tại':'Current RAM usage','Mức sử dụng ổ đĩa hệ thống':'Current disk usage',
      'Tất cả video trong thư viện':'All videos in library','Thư viện':'Library','Lưu trữ':'Storage','Cấu hình':'Configuration','Xem log':'View logs',
      'Đăng nhập để vào trang quản trị.':'Sign in to access admin panel.','Tài khoản':'Username','Mật khẩu':'Password','Đăng nhập':'Sign in',
      'Chưa có preset. Upload sẽ dùng cấu hình hiện tại.':'No preset yet. Upload will use current form settings.','Tóm tắt preset đang dùng':'Current preset summary',
      'Đang kiểm tra...':'Checking...','Sẵn sàng':'Ready','Cần kiểm tra':'Needs attention','Thiếu':'Missing','Bật':'On','Tắt':'Off','Có':'Yes','Không':'No',
      'Quản lý category':'Category manager','Thêm':'Add','Chưa có category.':'No categories yet.','Không chọn':'None','Thêm / xoá category để dùng cho preset, upload và lọc thư viện.':'Add / remove categories for presets, uploads and library filters.',
      'Lưu cài đặt':'Save settings','Test kết nối':'Test connection','Kết nối Google Drive':'Connect Google Drive','Lưu account':'Save account','Lưu category':'Save category','Lưu cài đặt Player':'Save player settings','Lưu cấu hình Upload':'Save upload settings','Lưu cấu hình Embed + Watermark':'Save embed + watermark settings',
      'Đã copy':'Copied','Đã lưu':'Saved','Lỗi':'Error','Xoá':'Delete','Huỷ':'Cancel','Đóng':'Close','Sửa':'Edit','Thao tác':'Actions','Trạng thái':'Status','Thời gian':'Time','Nội dung':'Content','Nguồn':'Source',
      'Link video':'Video URL','Nhập link video':'Enter video URL','Chọn file video':'Select video files','Chưa chọn file nào.':'No file selected.','Chọn file subtitle':'Select subtitle file','Chưa chọn subtitle.':'No subtitle selected.',
      'Subtitle':'Subtitle','Lấy từ form upload':'Load from upload form','Lưu preset':'Save preset','Mặc định':'Default','Hệ thống ổn định':'System healthy',
      'Chuyển đổi HLS':'HLS Conversion','Chuyển đổi video sang định dạng HLS để streaming':'Convert video to HLS format for streaming','Mã hoá AES':'AES Encryption','Bật để mã hoá HLS bằng AES-128':'Enable AES-128 encryption for HLS',
      'Tạo thumbnail':'Create thumbnail','Giữ file gốc':'Keep original file','Bật tắt tạo thumbnail':'Toggle thumbnail generation','Bật tắt giữ file gốc':'Toggle keeping original file','Bật tắt đổi tên segment':'Toggle segment rename','Mượt seek':'Smooth seeking','Cân bằng':'Balanced','An toàn':'Safe',
      'Quản lý storage & account':'Manage storage & accounts','Quản lý nhà cung cấp lưu trữ và account của bạn':'Manage storage providers and your accounts','Thêm / sửa account':'Add / edit account','Nền tảng':'Platform','Chọn nền tảng':'Select platform','Chọn nền tảng để nhập thông tin account.':'Choose a platform to enter account details.',
      'Player mặc định':'Default player','Cài đặt Player':'Player settings','Hướng dẫn biến':'Variable guide','Hướng dẫn dùng biến':'Usage guide','JSON nâng cao':'Advanced JSON','Nâng cao':'Advanced','Cơ bản':'Basic','Cấu hình video':'Video configuration','Cấu hình Upload':'Upload configuration','Cấu hình Upload nâng cao':'Advanced upload configuration','Cấu hình video (Preset)':'Video configuration (Preset)',
      'Danh sách video':'Video list','Thông tin video đã upload':'Uploaded video info','Chi tiết storage của file gốc đã lưu':'Stored original file details','Không có URL':'No URL','Domain nhúng':'Embed domain','Domain hiện tại':'Current domain','Link m3u8 / play':'m3u8 / play URL','Embed URL':'Embed URL','Code iframe':'Iframe code',
      'Xác nhận xoá video':'Confirm video deletion','Bạn có chắc muốn xoá video này không?':'Are you sure you want to delete this video?','Đổi category':'Change category','Cập nhật nhanh category cho video':'Quickly update video category',
      'Video gốc':'Original video','Không tiêu đề':'Untitled','Chưa có account.':'No accounts yet.','Chưa có upload thành công.':'No successful uploads yet.','Chưa có video.':'No videos yet.','Chưa có log patch':'No patch logs yet.','Chưa có rule watermark.':'No watermark rules yet.',
      'Tiến trình upload / xử lý':'Upload / processing progress','Upload đã vào hàng xử lý':'Upload has been queued for processing','Đã đưa vào hàng xử lý nền...':'Queued in background...','Đang upload':'Uploading','Đang chờ':'Waiting','Hoàn tất':'Completed','Đã huỷ':'Cancelled','Job lỗi':'Failed jobs','Job lỗi hoặc lỗi một phần':'Failed or partial jobs',
      'License hiện tại':'Current license','Gói hiện tại':'Current plan','Nhập / đổi license key':'Enter / change license key','Kích hoạt':'Activate','Dry-run lỗi:':'Dry-run error:','Rollback lỗi:':'Rollback error:','Rollback gần nhất':'Latest rollback',
      'Tài khoản quản trị':'Admin account','Mật khẩu hiện tại':'Current password','Mật khẩu mới':'New password','Nhập lại mật khẩu mới':'Confirm new password','Mật khẩu mới nhập lại chưa khớp':'New password confirmation does not match','Mật khẩu hiện tại không đúng':'Current password is incorrect','Password hiện tại không đúng':'Current password is incorrect',
      'Chúc anh một ngày làm việc hiệu quả ✨':'Have a productive day ✨',
      '-- Chọn 1 storage --':'-- Select storage --','-- Chọn category --':'-- Select category --','-- Chọn nền tảng --':'-- Select platform --','-- Không chọn --':'-- None --',
      '-- Đang tải storage hợp lệ --':'-- Loading available storages --','Bật tắt HLS':'Toggle HLS','Bật tắt mã hoá AES':'Toggle AES encryption','Bật tắt đổi tên segment':'Toggle segment rename',
      'Bật tắt tạo thumbnail':'Toggle thumbnail generation','Bật tắt giữ file gốc':'Toggle keep original file','Chi tiết storage của file gốc đã lưu':'Stored original file details',
      'Chọn file subtitle':'Select subtitle file','Chọn file video':'Select video files','Chọn lại file để resume':'Re-select file to resume','Chọn tất cả':'Select all',
      'Danh sách video':'Video list','Domain nhúng':'Embed domain','Embed URL':'Embed URL','Link m3u8 / play':'m3u8 / play URL','Code iframe để chèn website':'Iframe code for embedding',
      'File gốc':'Original file','Thông tin video đã upload':'Uploaded video information','Tiến trình upload / xử lý':'Upload / processing progress',
      'Đang upload':'Uploading','Đang chờ':'Waiting','Hoàn tất':'Completed','Huỷ bởi người dùng':'Cancelled by user','Lỗi xử lý':'Processing error',
      'Lưu Trữ':'Storage','Lưu trữ':'Storage','Cấu Hình':'Configuration','Cấu hình':'Configuration','Tài Khoản':'Account','Tài khoản':'Account',
      'Lưu FFmpeg Settings':'Save FFmpeg settings','Mã hoá AES':'AES Encryption','Mượt seek':'Smooth seek','Cân bằng':'Balanced','An toàn':'Safe',
      'Hướng dẫn biến':'Variable guide','Hướng dẫn dùng biến':'How to use variables','Hướng dẫn biến Custom Player':'Custom Player variable guide',
      'JSON nâng cao':'Advanced JSON','Nâng cao':'Advanced','Cơ bản':'Basic','Nền tảng':'Platform','Loại':'Type','Nội dung':'Content',
      'Trạng thái':'Status','Thời gian':'Time','Thao tác':'Actions','Huỷ':'Cancel','Đóng':'Close','Xoá':'Delete','Có lỗi':'Has errors','Không có':'None',
      'Kích hoạt':'Activate','License hiện tại':'Current license','Gói hiện tại':'Current plan','Nhập / đổi license key':'Enter / change license key',
      'Mật khẩu hiện tại':'Current password','Mật khẩu mới':'New password','Nhập lại mật khẩu mới':'Confirm new password',
      'Mật khẩu mới nhập lại chưa khớp':'New password confirmation does not match','Mật khẩu hiện tại không đúng':'Current password is incorrect','Password hiện tại không đúng':'Current password is incorrect','Đăng nhập để vào trang quản trị.':'Sign in to access admin panel.',
      'Không tiêu đề':'Untitled','Chưa cấu hình link Telegram support':'Telegram support link not configured','Chưa cấu hình link Facebook support':'Facebook support link not configured',
      'Khuyên dùng 4–20MB. Lớn hơn nhanh hơn nhưng dễ timeout hơn.':'Recommended 4–20MB. Larger is faster but may timeout.',
      'Mode đang bật':'Mode enabled','Mode đang tắt':'Mode disabled','Job lỗi':'Failed jobs','Job lỗi hoặc lỗi một phần':'Failed or partial jobs',
      'Không có URL':'No URL','Không tạo được job xử lý':'Failed to create processing job','Không tạo được phiên upload chunk':'Failed to create chunk upload session',
      'Không nhận được token':'Failed to get token','File upload không hợp lệ':'Invalid upload file','JSON không hợp lệ':'Invalid JSON','JSON phải là mảng account':'JSON must be an account array',
      'Load videos lỗi:':'Load videos error:','Load history lỗi:':'Load history error:','Lỗi lấy embed:':'Embed fetch error:','Lỗi GD:':'Google Drive error:',
      'Lỗi connect account:':'Account connect error:','Lỗi mạng upload':'Upload network error','Lỗi mạng upload chunk':'Chunk upload network error','Lỗi upload chunk':'Chunk upload error',
      'Đã copy':'Copied','Đã lưu':'Saved','Lưu lỗi:':'Save error:','Dry-run lỗi:':'Dry-run error:','Rollback lỗi:':'Rollback error:',
      'Bật':'On','Tắt':'Off','Có':'Yes','Không':'No','Chưa có':'Not available','Đang chờ':'Waiting','Đang upload':'Uploading','Hoàn tất':'Completed','Lỗi':'Error',
      'Chọn nền tảng trước':'Select a platform first','Chọn nền tảng để nhập thông tin account.':'Select a platform to enter account details.',
      'Chọn nền tảng trước, form sẽ đổi theo nền tảng':'Select a platform first, form will switch accordingly',
      'Chọn file trước':'Select files first','Anh chọn file trước':'Please select files first',
      'Anh chọn file subtitle trước khi upload.':'Please select subtitle file before upload.',
      'Anh nhập mật khẩu':'Please enter password','Anh nhập license key trước':'Please enter license key first',
      'Anh chọn ít nhất 1 sever lưu':'Please select at least 1 storage server','Anh chọn ít nhất 2 video để tạo embed multi server.':'Please select at least 2 videos for multi-server embed.',
      'Các video đã chọn chưa đủ link play hợp lệ.':'Selected videos do not have enough valid play links.',
      'Không tìm thấy file tạm':'Temporary file not found','Token tạm đã hết hạn (cần chọn lại file để upload lại)':'Temporary token expired (reselect file to upload again)',
      'Resume token không hợp lệ (422). Chọn lại file để resume hoặc upload mới.':'Invalid resume token (422). Reselect file to resume or start new upload.',
      'Chunk timeout, anh retry để resume tiếp':'Chunk timeout, retry to continue resume',
      'Không đọc được dữ liệu file gốc':'Cannot read original file data','Không tạo được job xử lý':'Failed to create processing job',
      'Không tạo được phiên upload chunk':'Failed to create chunk upload session','Lỗi mạng upload':'Upload network error',
      'Lỗi mạng upload chunk':'Chunk upload network error','Lỗi upload chunk':'Chunk upload error',
      'Import đã vào hàng xử lý':'Import queued for processing','Đã đưa vào hàng xử lý nền...':'Queued in background...',
      'Load settings lỗi:':'Load settings error:','Load patch status lỗi:':'Load patch status error:','Status lỗi:':'Status error:',
      'Load videos lỗi:':'Load videos error:','Load history lỗi:':'Load history error:','Lỗi lấy embed:':'Embed fetch error:',
      'Lỗi connect account:':'Account connect error:','Lỗi GD:':'Google Drive error:','JSON không hợp lệ':'Invalid JSON',
      'JSON phải là mảng account':'JSON must be an array of accounts','Không nhận được token':'Failed to receive token',
      'File upload không hợp lệ':'Invalid upload file','Không có URL':'No URL','Không tiêu đề':'Untitled',
      'Bị khoá ở Trial':'Locked in Trial','Nâng cấp premium để kích hoạt lại account này':'Upgrade to premium to re-enable this account',
      'Mode tắt sẽ bị ẩn khỏi tab Lưu Trữ và cũng không hiện trong Upload.':'Disabled mode will be hidden in Storage tab and Upload.',
      'Mỗi dòng 1 domain (vd:':'One domain per line (e.g.:','Domain hiện tại':'Current domain','Domain nhúng':'Embed domain',
      'Code iframe để chèn website':'Iframe code for embedding website','Link m3u8 / play':'m3u8 / play link',
      'Xác nhận xoá video':'Confirm delete video','Bạn có chắc muốn xoá video này không?':'Are you sure you want to delete this video?',
      'Cập nhật nhanh category cho video':'Quickly update category for video','Đổi category':'Change category',
      'Danh sách video':'Video list','Thông tin video đã upload':'Uploaded video info','File gốc':'Original file',
      'Tiến trình upload / xử lý':'Upload / processing progress','Job đã tạo thành công':'Job created successfully',
      'Job lỗi':'Failed jobs','Job lỗi hoặc lỗi một phần':'Failed or partial jobs','Không có job lỗi.':'No failed jobs.',
      'Chưa có file trong hàng chờ.':'No files in queue.','Chưa có upload thành công.':'No successful uploads yet.',
      'Chưa có video.':'No videos yet.','Chưa có account.':'No accounts yet.','Chưa có account':'No accounts',
      'Chưa có category.':'No categories yet.','Chưa có rule watermark.':'No watermark rules yet.','Chưa có log patch':'No patch logs yet',
      'Đang kiểm tra...':'Checking...','Sẵn sàng':'Ready','Cần kiểm tra':'Needs attention','Hệ thống ổn định':'System healthy',
      'Lưu cài đặt':'Save settings','Lưu preset':'Save preset','Lấy từ form upload':'Load from upload form',
      'Lưu account':'Save account','Lưu category':'Save category','Lưu cài đặt Player':'Save player settings',
      'Lưu cấu hình Upload':'Save upload configuration','Lưu cấu hình Embed + Watermark':'Save embed + watermark configuration',
      'Test kết nối':'Test connection','Kết nối Google Drive':'Connect Google Drive','Kích hoạt':'Activate',
      'Nhập / đổi license key':'Enter / change license key','License hiện tại':'Current license','Gói hiện tại':'Current plan',
      'Mật khẩu hiện tại':'Current password','Mật khẩu mới':'New password','Nhập lại mật khẩu mới':'Confirm new password',
      'Mật khẩu mới nhập lại chưa khớp':'New password confirmation does not match','Mật khẩu hiện tại không đúng':'Current password is incorrect','Password hiện tại không đúng':'Current password is incorrect',
      'Chuyển đổi video sang định dạng HLS để streaming':'Convert video to HLS format for streaming',
      'Bật để mã hoá HLS bằng AES-128':'Enable AES-128 encryption for HLS',
      'Khuyên dùng 4–20MB. Lớn hơn nhanh hơn nhưng dễ timeout hơn.':'Recommended 4–20MB. Larger is faster but more timeout risk.',
      'Khuyên dùng khoảng 50–70% số core CPU.':'Recommended around 50–70% of CPU cores.',
      'Bật tắt giữ file gốc':'Toggle keep original file','Bật tắt tạo thumbnail':'Toggle create thumbnail','Bật tắt đổi tên segment':'Toggle segment rename',
      'Bật tắt HLS':'Toggle HLS','Bật tắt mã hoá AES':'Toggle AES encryption',
      'Dán cookie JSON tại đây':'Paste JSON cookie here','Dán JSON cookie export từ trình duyệt...':'Paste browser-exported JSON cookie...',
      'Quản lý nhà cung cấp lưu trữ và account của bạn':'Manage storage providers and your accounts',
      'Quản lý storage & account':'Manage storage & accounts','Thêm / sửa account':'Add / edit account','Nền tảng':'Platform',
      'Cài đặt Player':'Player settings','Player mặc định':'Default player','Hướng dẫn biến':'Variable guide',
      'Hướng dẫn dùng biến':'How to use variables','Hướng dẫn biến Custom Player':'Custom Player variable guide',
      'JSON nâng cao':'Advanced JSON','Nâng cao':'Advanced','Cơ bản':'Basic',
      'Cấu hình Upload':'Upload configuration','Cấu hình Upload nâng cao':'Advanced upload configuration','Cấu hình video':'Video configuration',
      'Khu riêng để chỉnh vị trí/kiểu hiển thị server list cho Multi Embed (không phụ thuộc Custom Player).':'Dedicated section to configure position/style for Multi Embed server list (independent from Custom Player).',
      'Server list vị trí preset':'Server list preset position',
      'Nằm ngoài ở trên (trái)':'Outside top (left)','Nằm ngoài ở trên (giữa)':'Outside top (center)','Nằm ngoài ở trên (phải)':'Outside top (right)',
      'Nằm ngoài ở dưới (trái)':'Outside bottom (left)','Nằm ngoài ở dưới (giữa)':'Outside bottom (center)','Nằm ngoài ở dưới (phải)':'Outside bottom (right)',
      'Nằm trong player (trái)':'Inside player (left)','Nằm trong player (phải)':'Inside player (right)',
      'Cấu hình video (Preset)':'Video configuration (Preset)','Mã hoá AES':'AES encryption','Mượt seek':'Smooth seeking','Cân bằng':'Balanced','An toàn':'Safe',
      'Tổng log':'Total logs','Log thành công':'Success logs','Log lỗi':'Error logs','Nguồn':'Source','Thời gian':'Time','Nội dung':'Content','Loại':'Type','Thao tác':'Actions',
      'Huỷ':'Cancel','Đóng':'Close','Xoá':'Delete','Sửa':'Edit','Thêm':'Add','Chọn tất cả':'Select all','Không chọn':'None','Logss':'Logs','Logsout':'Logout',
      'Theo dõi video thành công và job lỗi theo dạng log dễ nhìn':'Track successful videos and failed jobs in an easy-to-read log view',
      'Trạng thái':'Status','Nguồn':'Source','Nội dung':'Content','Thời gian':'Time',
      'ttb: Không copy được file upload tạm':'ttb: Failed to copy temporary upload file',
      'ttb: No copy được file upload tạm':'ttb: Failed to copy temporary upload file',
      'ttb: Không có resolution hợp lệ để convert!':'ttb: No valid resolution available for conversion!',
      'ttb: None resolution hợp lệ để convert!':'ttb: No valid resolution available for conversion!',
      'ttb: No thể tạo bất kỳ resolution nào!':'ttb: Could not generate any valid resolution!',
      'ttb: No thể tạo bất kỳ resolution nào':'ttb: Could not generate any valid resolution',
      'ttb: Không thể tạo bất kỳ resolution nào!':'ttb: Could not generate any valid resolution!',
      'ttb: Không thể tạo bất kỳ resolution nào':'ttb: Could not generate any valid resolution',
      'ttb: Upload image TikTok web không trả về uri/url_list hợp lệ':'ttb: TikTok web image upload did not return a valid uri/url_list',
      'Tổng video':'Total videos','Mode đang bật':'Mode enabled','Mode đang tắt':'Mode disabled','Hoạt động':'Active',
      'Storage file gốc':'Original file storage','Chưa chọn':'Not selected','Đổi tên segment':'Rename segment',
      'Nguồn video':'Video source','Chọn từ link':'Select from URL','Chọn video từ máy':'Select local video',
      'Link video':'Video URL','Chọn file video từ máy':'Select local video files','Chọn file video':'Choose video files',
      'Chưa chọn file nào.':'No files selected.','Lưu ý: Khi bật Subtitle: chỉ chọn 1 file video.':'Note: When Subtitle is enabled, select only 1 video file.',
      'Subtitle mềm (.srt / .vtt)':'Soft subtitle (.srt / .vtt)','Chọn file subtitle':'Choose subtitle file','Chưa chọn subtitle.':'No subtitle selected.',
      'Có thể chọn nhiều file để xếp hàng upload tuần tự (V1).':'You can select multiple files to queue uploads sequentially (V1).',
      'Hàng chờ upload':'Upload queue','Xoá các video chờ':'Clear queued videos','Tiến trình upload / xử lý':'Upload / processing progress',
      'Huỷ video hiện tại':'Cancel current video','Sẵn sàng.':'Ready.','Cấu hình Upload':'Upload configuration','Tiêu đề':'Title',
      'Chất lượng HLS':'HLS quality','Lưu Trữ':'Storage','Lưu trên máy chủ Google':'Store on Google servers','Lưu trên máy chủ CDN TikTok':'Store on TikTok CDN servers',
      'Cấu hình video':'Video configuration','Giữ file gốc':'Keep original file','Giữ lại file video gốc trên storage khi bật HLS':'Keep the original video file in storage when HLS is enabled',
      'Storage lưu file gốc':'Original file storage','Tạo thumbnail':'Create thumbnail','Tự động tạo thumbnail cho video':'Automatically generate a thumbnail for the video',
      'Chuyển Đổi HLS':'Convert to HLS','Chuyển đổi video sang định dạng HLS để streaming':'Convert video to HLS format for streaming',
      'Đổi tên segment (.png)':'Rename segments (.png)','Đổi đuôi segment sang .png để nguỵ trang':'Rename segment extension to .png for masking',
      'Mã hoá AES':'AES encryption','Bật để mã hoá HLS bằng AES-128':'Enable AES-128 encryption for HLS',
      'Thao tác':'Actions','Upload Video':'Upload Video','Tên video':'Video title','Chọn hash nguồn + hash đích rồi thêm.':'Select source hash + target hash before adding.','Bước':'Step',
      'Đang tải storage hợp lệ --':'Loading available storage --','Đang tải storage hợp lệ':'Loading available storage',
      'Lưu nội bộ máy chủ':'Store on local server','Đẩy sang FTP server':'Push to FTP server','Object storage + CDN':'Object storage + CDN',
      'Object storage B2':'B2 object storage','Refresh':'Refresh','Round robin':'Round robin','Fallback':'Fallback',
      'Quản lý storage & account':'Manage storage & accounts','Quản lý nhà cung cấp lưu trữ và account của bạn':'Manage your storage providers and accounts',
      'Thêm account':'Add account','Tải lại':'Reload','Chưa có file trong hàng chờ.':'No files in queue.',
      'Đang chờ...':'Waiting...','Huỷ video hiện tại':'Cancel current video','Xoá các video chờ':'Clear queued videos',
      'Có thể chọn nhiều file để xếp hàng upload tuần tự (V1).':'You can select multiple files for sequential upload queue (V1).',
      '🧹Delete các video chờ':'🧹Clear queued videos','🧹Delete các video waiting':'🧹Clear waiting videos','On để mã hoá HLS bằng AES-128':'Enable AES-128 encryption for HLS',
      'Not available file trong hàng chờ.':'No files in queue.',
      'Đang upload file lên server...':'Uploading file to server...','Uploading file lên server...':'Uploading file to server...','Uploading lại file lên server...':'Re-uploading file to server...','đang upload':'uploading','Đang upload':'Uploading','đã upload':'uploaded','Đã upload':'Uploaded','đang chạy':'running','Đang chạy':'Running','đang khởi tạo':'initializing','Đang khởi tạo':'Initializing','đang hoàn tất':'finishing','Đang hoàn tất':'Finishing','chờ':'waiting','Chờ':'Waiting',
      'Xử lý xong. Có thể bấm Play/Embed để xem.':'Xong. Có thể bấm Play để xem.',
      '✖️Cancel video hiện tại':'✖️Cancel current video','✖Cancel video hiện tại':'✖️Cancel current video','huỷ video này':'cancel this video','Cancel video hiện tại':'Cancel current video',
      'Đang xử lý sever TTB...':'Đang xử lý sever TikTok...','đang xử lý sever TTB...':'đang xử lý sever TikTok...','Đang xử lý sever TikTok...':'Processing TikTok server...','đang xử lý sever TikTok...':'processing TikTok server...','Sever:':'Server:','sever':'server','Xử lý segment':'Processing segments','xử lý segment':'processing segments','Xử lý segments':'Processing segments','đang tách hls':'splitting HLS','Đang tách HLS...':'Splitting HLS...','Đang tách hls...':'Splitting HLS...','Đang tách HLS cho TikTok..':'Splitting HLS for TikTok..','Đang tách HLS cho TikTok...':'Splitting HLS for TikTok...','Đã xong':'Completed','Đã Xong':'Completed','đã xong':'completed','Đã huỷ':'Cancelled','đã huỷ':'cancelled',
      '📁 Choose video files từ máy':'📁 Select local video files','Chưa chọn file nào.':'No files selected.','Chưa chọn subtitle.':'No subtitle selected.','Đang lấy trạng thái job...':'Fetching job status...',
      'Có thể chọn nhiều file để xếp hàng upload tuần tự (V1).':'You can select multiple files for sequential upload queue (V1).',
      'xong':'done','Delete các video chờ':'Clear queued videos','upload tạm':'temporary upload','Upload tạm':'Temporary upload','Upload tạm hoàn tất':'Temporary upload completed',
      'Cancelled upload tạm':'Cancelled temporary upload','Đã huỷ upload tạm':'Cancelled temporary upload','đã huỷ upload tạm':'cancelled temporary upload',
      'r2: No copy được file temporary upload':'r2: Failed to copy temporary upload file',
      'gdrive: No copy được file temporary upload':'gdrive: Failed to copy temporary upload file',
      'gdrive: No copy được file upload tạm':'gdrive: Failed to copy temporary upload file',
      'gdrive: Không copy được file temporary upload':'gdrive: Failed to copy temporary upload file',
      'gdrive: Không copy được file upload tạm':'gdrive: Failed to copy temporary upload file',
      'gdrive: Upload lên Google Drive thất bại: Token Google Drive hết hạn!':'gdrive: Google Drive upload failed: Google Drive token expired!',
      'Token Google Drive hết hạn!':'Google Drive token expired!',
      'Đang xử lý tuần tự từng video...':'Processing videos sequentially...','Đã thêm 1 file vào hàng chờ':'Added 1 file to queue','Đã thêm 1 file vào hàng chờ Ready.':'Added 1 file to queue. Ready.','Đã xong 0/1 sever':'Completed 0/1 server','đã xong 0/1 sever':'completed 0/1 server','• Đã xong 0/1 sever':'• Completed 0/1 server','Đã xong 0/1 sever •':'Completed 0/1 server •',
      'Đã thêm':'Added','vào hàng chờ':'to queue',
      'Danh sách video':'Video list','Thông tin video đã upload':'Uploaded video information','Embed multi server':'Multi-server embed',
      'Xoá đã chọn':'Delete selected','Tất cả':'All','Có HLS':'Has HLS','Không HLS':'No HLS','Tên account...':'Account name...',
      'Từ ngày':'From date','Đến ngày':'To date','Video':'Video','Nguồn':'Source','Dung lượng':'Size','Upload':'Upload',
      'File gốc':'Original file','Đang xử lý nền...':'Processing in background...','Sửa preset upload mặc định':'Edit default upload preset',
      'Category':'Category','Mode':'Mode','Duration':'Duration','Subtitle':'Subtitle','Play':'Play','Embed':'Embed',
      'Refresh':'Refresh','Local Storage':'Local Storage','FTP Server':'FTP Server','Cloudflare R2':'Cloudflare R2','Backblaze B2':'Backblaze B2',
      'Google Drive':'Google Drive','TikTok':'TikTok','Chọn tất cả':'Select all','Xóa đã chọn':'Delete selected','Xóa':'Delete',
      'Thông tin video đã upload':'Uploaded video information','Không tiêu đề':'Untitled','Đổi category':'Change category',
      'Layout giống cấu hình upload để chỉnh nhanh':'Layout matches upload configuration for quick editing',
      'Có':'Yes','Không':'No',
      'Cơ bản':'Basic','Cấu hình video':'Video configuration','Nâng cao':'Advanced',
      'Bật/Tắt mode tổng':'Enable/disable overall modes','Mode tắt sẽ bị ẩn khỏi tab Lưu Trữ và cũng không hiện trong Upload.':'Disabled mode is hidden in Storage and Upload tabs.',
      'Preset upload mặc định':'Default upload preset','Tóm tắt preset đang dùng':'Current preset summary','Chưa có preset. Upload sẽ dùng cấu hình hiện tại.':'No preset yet. Upload will use current configuration.',
      'Quản lý category':'Category management','Thêm / xoá category để dùng cho preset, upload và lọc thư viện.':'Add/remove categories for preset, upload and library filtering.',
      'Tên category mới':'New category name','Chưa có category.':'No categories yet.',
      'Khuyên dùng khoảng 50–70% số core CPU.':'Recommended around 50–70% of CPU cores.','Đang bật':'Enabled','Đang tắt':'Disabled',
      'Lưu FFmpeg Settings':'Save FFmpeg settings','Cài đặt Player':'Player settings','Chọn player dùng cho embed toàn hệ thống. Premium có thể gắn VAST / VMAP.':'Choose the default embed player. Premium supports VAST / VMAP.',
      'Player mặc định':'Default player','Ưu tiên chạy ads với':'Prefer running ads with',
      'An toàn':'Safe','Cân bằng':'Balanced','Mượt seek':'Smooth seek','Áp dụng cho player dùng HLS.js. Không áp dụng cho JW Player engine riêng.':'Applies to HLS.js players only. Not applied to JW Player engine.',
      'Lưu cài đặt Player':'Save player settings','Dùng khi bật Custom Player. Có thể chèn HTML/CSS/JS riêng và tận dụng các biến hệ thống.':'Used when Custom Player is enabled. You can inject custom HTML/CSS/JS and use system variables.',
      'Biến hỗ trợ':'Supported variables','Cấu hình Upload nâng cao':'Advanced upload configuration','Để trống = dùng /api cùng domain. Dùng khi cần upload domain riêng (DNS only).':'Leave empty to use /api on the same domain. Use when a separate upload domain is needed (DNS only).',
      'Khuyên dùng 4–20MB. Lớn hơn nhanh hơn nhưng dễ timeout hơn.':'Recommended 4–20MB. Larger is faster but more timeout-prone.',
      'Lưu cấu hình Upload':'Save upload configuration','Cấu hình Embed nâng cao (Whitelist + Host alias + Watermark)':'Advanced embed configuration (Whitelist + Host alias + Watermark)',
      'Domain được phép nhúng':'Allowed embed domains','Nhập các host HLS alias, mỗi dòng 1 domain. Khi lấy embed có thể chọn domain nào trong danh sách này.':'Enter HLS host aliases, one domain per line. You can choose any of them when generating embed.',
      'Chọn domain + logo PNG + vị trí + thời lượng hiển thị.':'Choose domain + PNG logo + position + display duration.',
      'Vị trí':'Position','Góc phải':'Top right','Góc trái':'Top left','Giữa':'Center',
      'Hiển thị':'Display','15 giây đầu':'First 15 seconds','Toàn video':'Whole video',
      'Thêm':'Add','Chưa có rule watermark.':'No watermark rules yet.','Lưu cấu hình Embed + Watermark':'Save Embed + Watermark configuration',
      'Xoá đồng bộ trên storage':'Delete sync on storage','Khi xoá video trong danh sách, hệ sẽ xoá luôn file/folder trên storage nếu bật.':'When deleting a video from the list, files/folders on storage will also be deleted if enabled.',
      'Update ngay':'Update now','Trạng thái / log update':'Update status / logs','Chưa có log patch':'No patch logs yet.'
    };
    const __i18nTextNodes=[];
    const __langParam=new URLSearchParams(location.search).get('lang');
    if(__langParam==='vi' || __langParam==='en'){ localStorage.setItem('hls_ui_lang', __langParam); }
    let currentLang=(localStorage.getItem('hls_ui_lang')||'vi');
    function tr(path,fallback=''){const parts=String(path||'').split('.');let cur=I18N[currentLang]||I18N.vi;for(const p of parts){cur=cur?.[p];}return cur??fallback;}
    window.setLang = function(lang){currentLang=(lang==='en'?'en':'vi');localStorage.setItem('hls_ui_lang',currentLang);applyI18n();setTimeout(()=>location.reload(),120);}
    function collectI18nNodes(){
      if(__i18nTextNodes.length) return;
      const walker=document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node){
          const p=node.parentElement;
          if(!p) return NodeFilter.FILTER_REJECT;
          const tag=(p.tagName||'').toLowerCase();
          if(['script','style','textarea'].includes(tag)) return NodeFilter.FILTER_REJECT;
          const txt=String(node.nodeValue||'');
          if(!txt.trim()) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      let n; while((n=walker.nextNode())){ __i18nTextNodes.push({node:n, original:n.nodeValue}); }
    }
    function applyPhraseI18n(){
      collectI18nNodes();
      __i18nTextNodes.forEach(item=>{
        let txt=String(item.original||'');
        if(currentLang==='en'){
          Object.entries(I18N_PHRASES_EN).forEach(([vi,en])=>{ txt=txt.split(vi).join(en); });
        }
        item.node.nodeValue=txt;
      });
      document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el=>{
        const orig=el.dataset.phOrig||el.getAttribute('placeholder')||'';
        if(!el.dataset.phOrig) el.dataset.phOrig=orig;
        let next=orig;
        if(currentLang==='en'){ Object.entries(I18N_PHRASES_EN).forEach(([vi,en])=>{ next=next.split(vi).join(en); }); }
        el.setAttribute('placeholder', next);
      });
    }
    function applyI18n(){
      const map={
        'i18n-menu-dashboard':'menuDashboard','i18n-menu-video':'menuVideo','i18n-menu-system':'menuSystem',
        'i18n-nav-overview':'navOverview','i18n-nav-history':'navHistory','i18n-nav-import':'navImport','i18n-nav-library':'navLibrary','i18n-nav-settings':'navSettings','i18n-nav-config':'navConfig','i18n-nav-account':'navAccount','i18n-logout':'logout','i18n-hero-badge':'heroBadge','i18n-hero-title':'heroTitle','i18n-hero-desc':'heroDesc'
      };
      Object.entries(map).forEach(([id,key])=>{const el=$(id); if(el) el.textContent=tr(key, el.textContent||'');});
      document.querySelectorAll('[data-i18n-text]').forEach(el=>{
        const vi=el.dataset.i18nVi || el.dataset.i18nOrig || el.textContent || '';
        if(!el.dataset.i18nOrig) el.dataset.i18nOrig=vi;
        const en=el.getAttribute('data-i18n-text') || vi;
        el.textContent=(currentLang==='en'?en:el.dataset.i18nOrig);
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
        const vi=el.dataset.i18nPhOrig || el.getAttribute('placeholder') || '';
        if(!el.dataset.i18nPhOrig) el.dataset.i18nPhOrig=vi;
        const en=el.getAttribute('data-i18n-placeholder') || vi;
        el.setAttribute('placeholder', currentLang==='en'?en:el.dataset.i18nPhOrig);
      });
      [['lang-vi','lang-en']].forEach(([viId,enId])=>{
        $(viId)?.classList.toggle('pri', currentLang==='vi'); $(enId)?.classList.toggle('pri', currentLang==='en');
        $(viId)?.classList.toggle('soft', currentLang!=='vi'); $(enId)?.classList.toggle('soft', currentLang!=='en');
      });
      const mode=detectPage();
      const pht=$('page-header-title'), phc=$('page-header-crumb');
      if(pht) pht.textContent=tr('page.'+mode, pht.textContent||'');
      if(phc) phc.textContent=tr('page.'+mode, phc.textContent||'');
      applyPhraseI18n();
    }
