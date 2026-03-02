from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Workout, Leaderboard
from django.utils import timezone

class Command(BaseCommand):
    help = 'Populate the database with initial data for Octofit Tracker'

    def handle(self, *args, **options):
        # Create Teams
        team1 = Team.objects.create(name='Alpha Team')
        team2 = Team.objects.create(name='Beta Team')

        # Create Users
        user1 = User.objects.create(username='alice', email='alice@example.com', first_name='Alice', last_name='Smith', team=team1)
        user2 = User.objects.create(username='bob', email='bob@example.com', first_name='Bob', last_name='Brown', team=team2)
        user3 = User.objects.create(username='carol', email='carol@example.com', first_name='Carol', last_name='Jones', team=team1)

        # Add members to teams
        team1.members.add(user1, user3)
        team2.members.add(user2)

        # Create Activities
        Activity.objects.create(user=user1, type='Running', duration=30, calories=250, date=timezone.now().date())
        Activity.objects.create(user=user2, type='Cycling', duration=45, calories=400, date=timezone.now().date())
        Activity.objects.create(user=user3, type='Swimming', duration=60, calories=500, date=timezone.now().date())

        # Create Workouts
        Workout.objects.create(name='Cardio Blast', description='High intensity cardio workout', suggested_for='all')
        Workout.objects.create(name='Strength Builder', description='Strength training for beginners', suggested_for='beginners')

        # Create Leaderboard
        Leaderboard.objects.create(team=team1, score=750)
        Leaderboard.objects.create(team=team2, score=400)

        self.stdout.write(self.style.SUCCESS('Database populated with initial Octofit Tracker data.'))
