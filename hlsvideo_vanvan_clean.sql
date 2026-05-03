/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.14-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: hlsvideo_release_tmp_20260503_083743
-- ------------------------------------------------------
-- Server version	10.11.14-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES
(1,'2025_10_26_181622_create_videos_table',1),
(2,'2025_10_26_181643_create_site_settings_table',1),
(3,'2026_04_18_160500_add_multi_accounts_to_site_settings',2),
(4,'2026_04_18_170800_add_multi_account_flags_to_site_settings',3),
(5,'2026_04_18_172800_add_default_account_indexes_to_site_settings',4),
(6,'2026_04_18_181800_add_ftp_multi_accounts_to_site_settings',5),
(7,'2026_04_18_192000_add_storage_meta_to_videos',6),
(8,'2026_04_18_194000_add_delete_sync_flag_to_site_settings',7),
(9,'2026_04_19_103500_add_b2_storage_to_site_settings',8),
(10,'2026_04_19_120500_add_mode_enabled_flags_to_site_settings',9),
(11,'2026_04_19_124500_add_local_mode_enabled_to_site_settings',10),
(12,'2026_04_19_155500_add_categories_to_settings_and_videos',11),
(13,'2026_04_20_120000_add_ttb_mode_to_site_settings',12),
(14,'2026_04_21_174700_add_embed_whitelist_to_site_settings',13),
(15,'2026_04_21_180000_add_embed_strict_mode_to_site_settings',14),
(16,'2026_04_21_182000_add_original_storage_meta_to_videos',15),
(17,'2026_04_22_041200_add_ffmpeg_settings_to_site_settings',16),
(18,'2026_04_22_042100_add_ffmpeg_threads_to_site_settings',17),
(19,'2026_04_22_130500_add_embed_watermark_rules_to_site_settings',18),
(20,'2026_04_22_131800_add_embed_player_type_to_site_settings',19),
(21,'2026_04_22_145600_add_license_fields_to_site_settings',20),
(22,'2026_04_22_151500_add_admin_auth_to_site_settings',21),
(23,'2026_04_22_201000_add_embed_host_aliases_to_site_settings',22),
(24,'2026_04_23_063800_add_license_plan_features_to_site_settings',23),
(25,'2026_04_23_091000_add_license_expires_at_to_site_settings',24),
(26,'2026_04_23_143500_add_embed_ads_fields_to_site_settings',25),
(27,'2026_04_23_154000_add_embed_custom_player_fields_to_site_settings',26),
(28,'2026_04_23_170500_add_embed_hlsjs_config_to_site_settings',27),
(29,'2026_04_24_061800_add_upload_api_base_to_site_settings',28),
(30,'2026_04_24_081600_add_upload_chunk_mb_to_site_settings',29),
(31,'2026_04_25_162500_add_ffmpeg_scale_mode_to_site_settings',30),
(32,'2026_04_29_070000_add_custom_jw_fields_to_site_settings',31),
(33,'2026_05_02_150000_change_storage_account_to_text',32);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `storage_mode` varchar(255) NOT NULL DEFAULT 'local',
  `upload_api_base` varchar(255) DEFAULT NULL,
  `upload_chunk_mb` smallint(5) unsigned DEFAULT NULL,
  `local_path` varchar(255) NOT NULL DEFAULT 'storage/app/videos',
  `local_mode_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `ftp_hostname` varchar(255) DEFAULT NULL,
  `ftp_port` int(11) NOT NULL DEFAULT 21,
  `ftp_user` varchar(255) DEFAULT NULL,
  `ftp_pass` varchar(255) DEFAULT NULL,
  `ftp_path` varchar(255) DEFAULT NULL,
  `ftp_accounts_json` longtext DEFAULT NULL,
  `ftp_multi_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `ftp_round_robin_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `ftp_fallback_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `ftp_default_account_index` int(11) NOT NULL DEFAULT 0,
  `ftp_mode_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `r2_bucket` varchar(255) DEFAULT NULL,
  `r2_key` varchar(255) DEFAULT NULL,
  `r2_secret` varchar(255) DEFAULT NULL,
  `r2_endpoint` varchar(255) DEFAULT NULL,
  `r2_accounts_json` longtext DEFAULT NULL,
  `r2_multi_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `r2_round_robin_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `r2_fallback_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `r2_default_account_index` int(11) NOT NULL DEFAULT 0,
  `r2_mode_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `b2_bucket` varchar(255) DEFAULT NULL,
  `b2_key` varchar(255) DEFAULT NULL,
  `b2_secret` varchar(255) DEFAULT NULL,
  `b2_endpoint` varchar(255) DEFAULT NULL,
  `b2_accounts_json` longtext DEFAULT NULL,
  `b2_multi_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `b2_round_robin_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `b2_fallback_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `b2_default_account_index` int(11) NOT NULL DEFAULT 0,
  `b2_mode_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `gdrive_client_id` text DEFAULT NULL,
  `gdrive_client_secret` text DEFAULT NULL,
  `gdrive_redirect_uri` text DEFAULT NULL,
  `gdrive_shared_drive_id` varchar(255) DEFAULT NULL,
  `gdrive_mode` varchar(255) NOT NULL DEFAULT 'mydrive',
  `gdrive_accounts_json` longtext DEFAULT NULL,
  `gdrive_multi_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `gdrive_round_robin_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `gdrive_fallback_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `gdrive_default_account_index` int(11) NOT NULL DEFAULT 0,
  `gdrive_mode_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `ttb_accounts_json` longtext DEFAULT NULL,
  `ttb_multi_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `ttb_round_robin_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `ttb_fallback_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `ttb_default_account_index` int(11) NOT NULL DEFAULT 0,
  `ttb_mode_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `delete_sync_storage` tinyint(1) NOT NULL DEFAULT 1,
  `categories_json` text DEFAULT NULL,
  `embed_domain_whitelist` longtext DEFAULT NULL,
  `embed_host_aliases` text DEFAULT NULL,
  `embed_strict_mode` tinyint(1) NOT NULL DEFAULT 1,
  `embed_watermark_rules_json` longtext DEFAULT NULL,
  `embed_player_type` varchar(20) NOT NULL DEFAULT 'native',
  `embed_vast_url` text DEFAULT NULL,
  `embed_vmap_url` text DEFAULT NULL,
  `embed_custom_html` longtext DEFAULT NULL,
  `embed_custom_css` longtext DEFAULT NULL,
  `embed_custom_js` longtext DEFAULT NULL,
  `embed_jw_library_url` text DEFAULT NULL,
  `embed_jw_plugin_urls` text DEFAULT NULL,
  `embed_jw_setup_json` text DEFAULT NULL,
  `embed_hlsjs_config_json` text DEFAULT NULL,
  `license_key` varchar(191) DEFAULT NULL,
  `license_status` varchar(40) NOT NULL DEFAULT 'trial',
  `license_plan` varchar(40) DEFAULT NULL,
  `license_features_json` longtext DEFAULT NULL,
  `license_expires_at` varchar(191) DEFAULT NULL,
  `license_bound_domain` varchar(191) DEFAULT NULL,
  `license_last_check_at` datetime DEFAULT NULL,
  `admin_username` varchar(120) DEFAULT NULL,
  `admin_password_hash` text DEFAULT NULL,
  `ffmpeg_preset` varchar(40) DEFAULT NULL,
  `ffmpeg_fps` int(11) DEFAULT NULL,
  `ffmpeg_threads` int(11) DEFAULT NULL,
  `hls_segment_duration` int(11) DEFAULT NULL,
  `ffmpeg_scale_pad_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `ffmpeg_scale_mode` varchar(12) NOT NULL DEFAULT 'pad',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES
(1,'local','',20,'storage/app/videos-local',1,'',21,'','','','[]',0,0,0,0,1,'','','','','[]',0,0,0,0,1,'','','','','[]',0,0,0,0,1,'','','','','mydrive','[]',0,0,0,0,1,'[]',0,0,0,0,1,1,'[\"Clip\",\"Short\",\"Film\",\"Funny\",\"Other\"]','','',0,'','videojs','','','','','','','','','{\"maxBufferLength\":45,\"maxMaxBufferLength\":150,\"backBufferLength\":30,\"maxBufferHole\":0.5,\"startFragPrefetch\":true,\"multiServerListPosition\":\"inside-right\",\"multiServerListCss\":\"\",\"multiServerListJs\":\"\",\"thumbnailMaxWidth\":1080,\"ffmpegScaleMode\":\"auto\"}','ZUDUTE42HJS9SNUDU6QYSXW4','active','premium','{\"dark_mode\":true,\"delete_sync_storage\":true,\"embed_multi_domain\":true,\"embed_player_advanced\":true,\"embed_whitelist\":true,\"encrypt_hls\":true,\"hls_quality_2k4k\":true,\"multi_account_storage\":true,\"multi_storage\":true,\"softsub\":true,\"storage_b2\":true,\"storage_ftp\":true,\"storage_gdrive\":true,\"storage_local\":true,\"storage_r2\":true,\"storage_ttb\":true,\"watermark_rules\":true}',NULL,'vanvan.vip','2026-05-03 12:09:29','admin','$2y$10$5FdL76RdaloIqUYqs0.hq.9GVaWItixu6ws15./NW1cHudXg9wBuO','veryfast',24,2,10,0,'auto','2026-04-18 11:39:22','2026-05-03 10:09:30');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `videos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `path` text NOT NULL,
  `storage_mode` varchar(30) DEFAULT NULL,
  `storage_account` text DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `uploaded_files_count` int(11) NOT NULL DEFAULT 1,
  `original_storage_json` longtext DEFAULT NULL,
  `size` bigint(20) NOT NULL DEFAULT 0,
  `duration` decimal(10,2) NOT NULL DEFAULT 0.00,
  `thumbnail` varchar(255) DEFAULT NULL,
  `converted` tinyint(1) NOT NULL DEFAULT 0,
  `hls_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `hls_playlist` text DEFAULT NULL,
  `hls_type` varchar(255) DEFAULT NULL,
  `webViewLink` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `videos_created_at_index` (`created_at`),
  KEY `videos_category_index` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=479 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'hlsvideo_release_tmp_20260503_083743'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-03  8:37:44
