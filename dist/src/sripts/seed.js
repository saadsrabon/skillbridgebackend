import bcrypt from "bcrypt";
import { prisma } from '../lib/prisma';
// Use bcrypt to hash passwords
async function hash(password, saltRounds) {
    return await bcrypt.hash(password, saltRounds);
}
async function main() {
    console.log('🌱 Starting database seeding...');
    // Clear existing data (in reverse order of dependencies)
    console.log('🗑️  Clearing existing data...');
    await prisma.review.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.availabilitySlot.deleteMany({});
    await prisma.tutorSubject.deleteMany({});
    await prisma.subject.deleteMany({});
    await prisma.studentProfile.deleteMany({});
    await prisma.tutorProfile.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.verification.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ Cleared existing data');
    // Hash password for all users
    const hashedPassword = await hash('password123', 10);
    // 1. Create Subjects
    console.log('📚 Creating subjects...');
    const subjects = await Promise.all([
        prisma.subject.create({
            data: { name: 'Mathematics', slug: 'mathematics' }
        }),
        prisma.subject.create({
            data: { name: 'Physics', slug: 'physics' }
        }),
        prisma.subject.create({
            data: { name: 'Chemistry', slug: 'chemistry' }
        }),
        prisma.subject.create({
            data: { name: 'Biology', slug: 'biology' }
        }),
        prisma.subject.create({
            data: { name: 'English', slug: 'english' }
        }),
        prisma.subject.create({
            data: { name: 'Computer Science', slug: 'computer-science' }
        }),
        prisma.subject.create({
            data: { name: 'Spanish', slug: 'spanish' }
        }),
        prisma.subject.create({
            data: { name: 'History', slug: 'history' }
        }),
    ]);
    console.log(`✅ Created ${subjects.length} subjects`);
    // 2. Create Admin User
    console.log('👑 Creating admin user...');
    const admin = await prisma.user.create({
        data: {
            id: 'admin-user-id-001',
            name: 'Admin User',
            email: 'admin@skillbridge.com',
            emailVerified: true,
            role: 'ADMIN',
            status: 'ACTIVE',
            phone: '+1234567890',
        }
    });
    await prisma.account.create({
        data: {
            id: 'admin-account-001',
            accountId: 'admin-account-001',
            providerId: 'credential',
            userId: admin.id,
            password: hashedPassword,
        }
    });
    console.log('✅ Created admin user (admin@skillbridge.com / password123)');
    // 3. Create Tutors
    console.log('👨‍🏫 Creating tutors...');
    const tutorData = [
        {
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@skillbridge.com',
            phone: '+1234567891',
            bio: 'PhD in Mathematics with 10 years of teaching experience. Specialized in calculus and algebra.',
            headline: 'Mathematics Expert - Calculus & Algebra Specialist',
            hourlyRate: 60,
            experience: 10,
            subjects: [subjects[0].id] // Mathematics
        },
        {
            name: 'Prof. Michael Chen',
            email: 'michael.chen@skillbridge.com',
            phone: '+1234567892',
            bio: 'Former university professor with expertise in Physics and Mathematics. Patient and thorough teaching style.',
            headline: 'Physics & Math Professor',
            hourlyRate: 55,
            experience: 8,
            subjects: [subjects[0].id, subjects[1].id] // Math, Physics
        },
        {
            name: 'Emily Rodriguez',
            email: 'emily.rodriguez@skillbridge.com',
            phone: '+1234567893',
            bio: 'Bilingual educator specializing in English and Spanish. Certified ESL instructor.',
            headline: 'English & Spanish Language Expert',
            hourlyRate: 45,
            experience: 6,
            subjects: [subjects[4].id, subjects[6].id] // English, Spanish
        },
        {
            name: 'Dr. James Wilson',
            email: 'james.wilson@skillbridge.com',
            phone: '+1234567894',
            bio: 'Chemistry PhD with a passion for making complex concepts simple. 12 years experience.',
            headline: 'Chemistry Specialist - All Levels',
            hourlyRate: 65,
            experience: 12,
            subjects: [subjects[2].id] // Chemistry
        },
        {
            name: 'Lisa Anderson',
            email: 'lisa.anderson@skillbridge.com',
            phone: '+1234567895',
            bio: 'Software engineer turned educator. Expert in programming, algorithms, and web development.',
            headline: 'Computer Science & Programming Tutor',
            hourlyRate: 70,
            experience: 7,
            subjects: [subjects[5].id] // Computer Science
        },
        {
            name: 'David Kim',
            email: 'david.kim@skillbridge.com',
            phone: '+1234567896',
            bio: 'Biology teacher with focus on molecular biology and genetics. Engaging and interactive lessons.',
            headline: 'Biology & Life Sciences Expert',
            hourlyRate: 50,
            experience: 5,
            subjects: [subjects[3].id] // Biology
        },
    ];
    const tutors = [];
    for (const tutor of tutorData) {
        const user = await prisma.user.create({
            data: {
                id: `tutor-${tutor.email}`,
                name: tutor.name,
                email: tutor.email,
                emailVerified: true,
                role: 'TUTOR',
                status: 'ACTIVE',
                phone: tutor.phone,
            }
        });
        await prisma.account.create({
            data: {
                id: `account-${user.id}`,
                accountId: `account-${user.id}`,
                providerId: 'credential',
                userId: user.id,
                password: hashedPassword,
            }
        });
        const tutorProfile = await prisma.tutorProfile.create({
            data: {
                userId: user.id,
                bio: tutor.bio,
                headline: tutor.headline,
                hourlyRate: tutor.hourlyRate,
                experience: tutor.experience,
                ratings: 0,
                reviewscount: 0,
            }
        });
        // Assign subjects to tutor
        for (const subjectId of tutor.subjects) {
            await prisma.tutorSubject.create({
                data: {
                    tutorId: tutorProfile.id,
                    subjectId: subjectId,
                }
            });
        }
        tutors.push({ user, profile: tutorProfile });
    }
    console.log(`✅ Created ${tutors.length} tutors`);
    // 4. Create Availability Slots for Tutors
    console.log('📅 Creating availability slots...');
    let slotCount = 0;
    for (const tutor of tutors) {
        // Create slots for next 2 weeks
        const baseDate = new Date('2026-02-10');
        for (let day = 0; day < 14; day++) {
            const currentDate = new Date(baseDate);
            currentDate.setDate(baseDate.getDate() + day);
            // Skip weekends
            if (currentDate.getDay() === 0 || currentDate.getDay() === 6)
                continue;
            // Create 3 slots per day: 10-11am, 2-3pm, 4-5pm
            const timeSlots = [
                { start: 10, end: 11 },
                { start: 14, end: 15 },
                { start: 16, end: 17 },
            ];
            for (const slot of timeSlots) {
                const startTime = new Date(currentDate);
                startTime.setHours(slot.start, 0, 0, 0);
                const endTime = new Date(currentDate);
                endTime.setHours(slot.end, 0, 0, 0);
                await prisma.availabilitySlot.create({
                    data: {
                        tutorId: tutor.user.id,
                        startTime,
                        endTime,
                        isBooked: false,
                    }
                });
                slotCount++;
            }
        }
    }
    console.log(`✅ Created ${slotCount} availability slots`);
    // 5. Create Students
    console.log('👨‍🎓 Creating students...');
    const studentData = [
        { name: 'John Smith', email: 'john.smith@student.com', phone: '+1234567901', bio: 'High school senior preparing for college entrance exams.' },
        { name: 'Emma Davis', email: 'emma.davis@student.com', phone: '+1234567902', bio: 'College freshman studying engineering.' },
        { name: 'Alex Martinez', email: 'alex.martinez@student.com', phone: '+1234567903', bio: 'Adult learner looking to switch careers to tech.' },
        { name: 'Sophie Taylor', email: 'sophie.taylor@student.com', phone: '+1234567904', bio: 'Middle school student needing help with science.' },
        { name: 'Ryan Brown', email: 'ryan.brown@student.com', phone: '+1234567905', bio: 'University student majoring in biology.' },
    ];
    const students = [];
    for (const student of studentData) {
        const user = await prisma.user.create({
            data: {
                id: `student-${student.email}`,
                name: student.name,
                email: student.email,
                emailVerified: true,
                role: 'STUDENT',
                status: 'ACTIVE',
                phone: student.phone,
            }
        });
        await prisma.account.create({
            data: {
                id: `account-${user.id}`,
                accountId: `account-${user.id}`,
                providerId: 'credential',
                userId: user.id,
                password: hashedPassword,
            }
        });
        const studentProfile = await prisma.studentProfile.create({
            data: {
                userId: user.id,
                bio: student.bio,
            }
        });
        students.push({ user, profile: studentProfile });
    }
    console.log(`✅ Created ${students.length} students`);
    // 6. Create Bookings
    console.log('📝 Creating bookings...');
    const bookingsData = [
        // Completed bookings (for reviews)
        {
            tutorIndex: 0, // Sarah Johnson
            studentIndex: 0, // John Smith
            status: 'COMPLETED',
            slotOffset: -5, // 5 days ago
            price: 60,
        },
        {
            tutorIndex: 1, // Michael Chen
            studentIndex: 1, // Emma Davis
            status: 'COMPLETED',
            slotOffset: -3,
            price: 55,
        },
        {
            tutorIndex: 2, // Emily Rodriguez
            studentIndex: 2, // Alex Martinez
            status: 'COMPLETED',
            slotOffset: -7,
            price: 45,
        },
        {
            tutorIndex: 4, // Lisa Anderson
            studentIndex: 2, // Alex Martinez
            status: 'COMPLETED',
            slotOffset: -4,
            price: 70,
        },
        // Confirmed bookings (upcoming)
        {
            tutorIndex: 0,
            studentIndex: 1,
            status: 'CONFIRMED',
            slotOffset: 2, // 2 days from now
            price: 60,
        },
        {
            tutorIndex: 3, // James Wilson
            studentIndex: 3, // Sophie Taylor
            status: 'CONFIRMED',
            slotOffset: 3,
            price: 65,
        },
        {
            tutorIndex: 5, // David Kim
            studentIndex: 4, // Ryan Brown
            status: 'CONFIRMED',
            slotOffset: 5,
            price: 50,
        },
    ];
    const bookings = [];
    for (const bookingData of bookingsData) {
        const tutor = tutors[bookingData.tutorIndex];
        const student = students[bookingData.studentIndex];
        if (!tutor || !student)
            continue;
        // Find an available slot
        const targetDate = new Date('2026-02-10');
        targetDate.setDate(targetDate.getDate() + bookingData.slotOffset);
        const availableSlot = await prisma.availabilitySlot.findFirst({
            where: {
                tutorId: tutor.user.id,
                isBooked: false,
                startTime: {
                    gte: targetDate,
                    lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
                }
            }
        });
        if (availableSlot) {
            const booking = await prisma.booking.create({
                data: {
                    tutorId: tutor.profile.id,
                    studentId: student.profile.id,
                    availableSlotId: availableSlot.id,
                    status: bookingData.status,
                    price: bookingData.price,
                }
            });
            // Mark slot as booked
            await prisma.availabilitySlot.update({
                where: { id: availableSlot.id },
                data: { isBooked: true }
            });
            bookings.push(booking);
        }
    }
    console.log(`✅ Created ${bookings.length} bookings`);
    // 7. Create Reviews for Completed Bookings
    console.log('⭐ Creating reviews...');
    const reviewsData = [
        {
            bookingIndex: 0,
            rating: 5,
            comment: 'Excellent tutor! Dr. Johnson explained calculus concepts very clearly. Highly recommend!',
        },
        {
            bookingIndex: 1,
            rating: 5,
            comment: 'Prof. Chen is amazing! His teaching style made physics so much easier to understand.',
        },
        {
            bookingIndex: 2,
            rating: 4,
            comment: 'Great Spanish lessons. Emily is patient and encouraging. Would book again!',
        },
        {
            bookingIndex: 3,
            rating: 5,
            comment: 'Lisa is a fantastic programming tutor. She helped me understand algorithms in just one session!',
        },
    ];
    for (const reviewData of reviewsData) {
        const booking = bookings[reviewData.bookingIndex];
        if (!booking)
            continue;
        await prisma.review.create({
            data: {
                bookingId: booking.id,
                studentId: booking.studentId,
                tutorId: booking.tutorId,
                rating: reviewData.rating,
                comment: reviewData.comment,
            }
        });
        // Update tutor ratings
        const tutorReviews = await prisma.review.findMany({
            where: { tutorId: booking.tutorId },
            select: { rating: true }
        });
        const totalRating = tutorReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = totalRating / tutorReviews.length;
        await prisma.tutorProfile.update({
            where: { id: booking.tutorId },
            data: {
                ratings: avgRating,
                reviewscount: tutorReviews.length,
            }
        });
    }
    console.log(`✅ Created ${reviewsData.length} reviews`);
    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - ${subjects.length} subjects`);
    console.log(`   - 1 admin user`);
    console.log(`   - ${tutors.length} tutors`);
    console.log(`   - ${students.length} students`);
    console.log(`   - ${slotCount} availability slots`);
    console.log(`   - ${bookings.length} bookings`);
    console.log(`   - ${reviewsData.length} reviews`);
    console.log('\n🔑 Login Credentials (all users):');
    console.log('   Password: password123');
    console.log('\n   Admin: admin@skillbridge.com');
    console.log('   Tutors: sarah.johnson@skillbridge.com, michael.chen@skillbridge.com, etc.');
    console.log('   Students: john.smith@student.com, emma.davis@student.com, etc.');
}
main()
    .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map