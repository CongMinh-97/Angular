# Test patterns (Pest syntax; PHPUnit equivalent in comments where it differs)

## 1. API resource endpoint (feature)
```php
uses(RefreshDatabase::class);

it('creates a user', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->postJson('/api/users', ['name' => 'An', 'email' => 'an@x.vn'])
        ->assertCreated()
        ->assertJsonPath('data.email', 'an@x.vn');

    $this->assertDatabaseHas('users', ['email' => 'an@x.vn']);
});

it('rejects invalid input', function (array $payload, string $field) {
    $this->actingAs(User::factory()->admin()->create())
        ->postJson('/api/users', $payload)
        ->assertUnprocessable()
        ->assertInvalid([$field]);
})->with([
    'missing name' => [['email' => 'a@x.vn'], 'name'],
    'bad email'    => [['name' => 'An', 'email' => 'nope'], 'email'],
]);

it('requires authentication', fn () => $this->postJson('/api/users', [])->assertUnauthorized());

it('forbids non-admins', function () {
    $this->actingAs(User::factory()->create())->postJson('/api/users', [])->assertForbidden();
});
```

## 2. Duplicate or unique on update
```php
it('allows keeping the same email on update', function () {
    $user = User::factory()->create(['email' => 'a@x.vn']);
    $this->actingAs($user)->putJson("/api/users/{$user->id}", ['name' => 'B', 'email' => 'a@x.vn'])->assertOk();
});
```

## 3. Action or service (unit-ish, with database)
```php
it('archives overdue invoices', function () {
    $this->travelTo(now()->setDate(2025, 1, 31));
    $overdue = Invoice::factory()->dueOn('2025-01-01')->create();
    $current = Invoice::factory()->dueOn('2025-02-15')->create();

    app(ArchiveOverdueInvoices::class)->handle();

    expect($overdue->fresh()->status)->toBe(InvoiceStatus::Archived)
        ->and($current->fresh()->status)->toBe(InvoiceStatus::Open);
});
```

## 4. Pure unit (no framework)
```php
it('formats VND', fn (int $amount, string $expected) => expect(Money::vnd($amount))->toBe($expected))
    ->with([[0, '0 ₫'], [1500000, '1.500.000 ₫']]);
```

## 5. Side effects with fakes
```php
Mail::fake(); Queue::fake(); Event::fake([UserRegistered::class]); Http::fake(['api.partner.com/*' => Http::response(['ok' => true])]);
// act...
Mail::assertQueued(WelcomeMail::class, fn ($m) => $m->hasTo('an@x.vn'));
Queue::assertPushed(SyncUserJob::class);
Event::assertDispatched(UserRegistered::class);
Http::assertSent(fn ($r) => $r->url() === 'https://api.partner.com/users');
```

## 6. Policy
```php
it('lets owners update their post', fn () =>
    expect((new PostPolicy)->update($post->user, $post))->toBeTrue());
```

## 7. Upload
```php
Storage::fake('local');
$this->actingAs($user)->post('/avatar', ['file' => UploadedFile::fake()->image('a.jpg')->size(200)])->assertOk();
Storage::disk('local')->assertExists('avatars/'.$user->id.'.jpg');
```
