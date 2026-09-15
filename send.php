<?php
declare(strict_types=1);
// PHP 7.4+; mail() must be configured on the hosting account.
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit;
}
function field(string $name, int $max = 1800): string {
    $value = $_POST[$name] ?? '';
    if (!is_string($value)) return '';
    $value = trim(str_replace(["\r", "\0"], '', $value));
    return function_exists('mb_substr') ? mb_substr($value, 0, $max, 'UTF-8') : substr($value, 0, $max);
}
function finish(bool $ok): void {
    header('Location: kontakt/index.html?' . ($ok ? 'sent=1' : 'error=1') . '#anfrage', true, 303);
    exit;
}
if (field('website') !== '') finish(false);
$name = field('name', 100);
$company = field('company', 140);
$email = filter_var(field('email', 254), FILTER_VALIDATE_EMAIL);
$phone = field('phone', 60);
$pickup = field('pickup', 180);
$destination = field('destination', 180);
$vehicle = field('vehicle', 80);
$date = field('date', 100);
$message = field('message');
$allowed = ['Teil- und Komplettladungen', 'Sonderfahrten', '40 t Planen-LKW', 'Allgemeine Transportanfrage'];
if ($name === '' || !$email || preg_match('/[\r\n]/', (string)$email) || $message === '' || field('privacy') !== '1' || !in_array($vehicle, $allowed, true)) finish(false);
$body = "Transportanfrage über dvtransporte.de\n\nName: $name\nFirma: $company\nE-Mail: $email\nTelefon: $phone\nAbholort: $pickup\nZielort: $destination\nLeistung: $vehicle\nTermin: $date\n\nAnforderungen:\n$message\n";
$subject = '=?UTF-8?B?' . base64_encode('Transportanfrage – ' . $vehicle) . '?=';
$headers = ['From: DV Transporte Website <info@dvtransporte.de>', 'Reply-To: ' . $email, 'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8'];
finish(function_exists('mail') && @mail('info@dvtransporte.de', $subject, $body, implode("\r\n", $headers)));
